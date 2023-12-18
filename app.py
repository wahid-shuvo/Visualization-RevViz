from flask import Flask, render_template
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = Flask(__name__)


class ReviewVisualization:
    def __init__(self):
        self.modelDf = self._load_dataset()
        self.pre_process_dataset()

    def _load_dataset(self):
        dataset = pd.read_csv('data/dataset.csv')
        dataset = dataset.drop(range(100, 1000))
        return dataset

    def get_train_test(self):
        return train_test_split(self.modelDf, train_size=0.65, random_state=420)

    def pre_process_dataset(self):
        self.modelDf['RE'] = [x / 100 for x in self.modelDf['RE']]
        self.modelDf['RENL'] = [x / 100 for x in self.modelDf['RENL']]
        self.modelDf = self.modelDf.dropna()
        self.modelDf['class'] = [0 if x == 'nu' else 1 for x in self.modelDf['class']]

    def get_normalized_ext_lib(self):
        external_df = self.modelDf[['ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP']]
        normalized_external_df = (external_df - external_df.min()) / (external_df.max() - external_df.min())
        normalized_external_df['ExtLib'] = self.modelDf['ExtLib']
        return normalized_external_df

    def prepare_data_to_feed(self, train, test):
        train = train.drop(['id', 'comment_text'], axis=1)
        test = test.drop(['id', 'comment_text'], axis=1)
        x_train = train.drop(['class'], axis=1)
        y_train = train['class']
        x_test = test.drop(['class'], axis=1)
        return x_train, y_train, x_test

    def get_prediction(self, rf_model, X_test):
        random_forest_preds = rf_model.predict(X_test)
        prediction=random_forest_preds.tolist()
        return prediction

    def train_model(self, X_train, y_train):
        random_forest = RandomForestClassifier(n_estimators=2000, random_state=420)
        model = random_forest.fit(X_train, y_train)
        return model

    def get_shap_values(self, rf_model, X_test, X_train):
        rf_explainer = shap.Explainer(rf_model)
        rf_shap_values = rf_explainer.shap_values(X_test, approximate=False, check_additivity=False)

        global_shap_values = rf_explainer.shap_values(X_train, approximate=False,
                                                      check_additivity=False)
        return rf_shap_values, global_shap_values, rf_explainer.expected_value

    def get_correlation_value(self, test):
        text_corr_df = test[['RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS', 'Sentiment', 'class']]
        heat_map_df = text_corr_df.corr()
        tex_cor_value = []
        for row, index in heat_map_df.iterrows():
            for i in index:
                tex_cor_value.append(i * 100)

        ext_corr_df = test[['ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP', 'ExtLib', 'class']]
        heat_map_df = ext_corr_df.corr()
        ext_cor_value = []
        for row, index in heat_map_df.iterrows():
            for i in index:
                ext_cor_value.append(i * 100)
        return tex_cor_value, ext_cor_value


@app.route('/')
@app.route('/home')
def run_rev_viz():
    model_instance = ReviewVisualization()

    train, test = model_instance.get_train_test()
    comment_text = test['comment_text'].tolist()
    x_train, y_train, x_test = model_instance.prepare_data_to_feed(train, test)

    #  Training the model using Random forest
    rf_model = model_instance.train_model(x_train, y_train)
    pred_result = model_instance.get_prediction(rf_model, x_test)
    normalized_external_df = model_instance.get_normalized_ext_lib()

    #   Generating SHAP values for explanation
    rf_shap_values, global_shap_values, expected_value = model_instance.get_shap_values(rf_model, x_test, x_train)
    global_pos_shap_values = global_shap_values[1].tolist();
    global_neg_shap_values = global_shap_values[0].tolist();

    test['shapValues'] = rf_shap_values[1].tolist()

    textual_cor_value, external_cor_value = model_instance.get_correlation_value(test)

    return render_template('home.html',
                           df1=test[['id', 'RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS',
                                     'Sentiment', 'shapValues']].to_dict(
                               orient='records'),
                           df=model_instance.modelDf[['id', 'RE', 'SWR', 'QR', 'CER', 'CS',
                                                      'Sentiment']].to_dict(
                               orient='records'),
                           comment_text=comment_text,
                           normalizedExternalDf=normalized_external_df.to_dict(orient='records'),
                           tex_cor_value=textual_cor_value,
                           ext_cor_value=external_cor_value,
                           y_pred=pred_result,
                           baseValue=expected_value[1],
                           global_pos_shap_values=global_pos_shap_values,
                           global_neg_shap_values=global_neg_shap_values
                           )


if __name__ == '__main__':
    app.run()
