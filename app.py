from flask import Flask, render_template
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def show_home():
    modelDf = pd.read_csv('data/dataset.csv')
    modelDf = modelDf.drop(range(100, 1000))
    modelDf['RE'] = [x / 100 for x in modelDf['RE']]
    modelDf['RENL'] = [x / 100 for x in modelDf['RENL']]
    modelDf = modelDf.dropna()
    modelDf['class'] = [0 if x == 'nu' else 1 for x in modelDf['class']]
    train, test = train_test_split(modelDf, train_size=0.65, random_state=420)
    commentId = test['id']
    comment_text=test['comment_text'].tolist()
    train = train.drop(['id','comment_text'], axis=1)
    test = test.drop(['id','comment_text'], axis=1)
    X_train = train.drop(['class'], axis=1)
    y_train = train['class']
    X_test = test.drop(['class'], axis=1)
    random_forest = RandomForestClassifier(n_estimators=2000, random_state=420)
    random_forest.fit(X_train, y_train)
    random_forest_preds = random_forest.predict(X_test)
    test['id'] = commentId
    pred_result = random_forest_preds.tolist()
    externalDF = modelDf[['ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP']]
    normalizedExternalDf = (externalDF - externalDF.min()) / (externalDF.max() - externalDF.min())
    normalizedExternalDf['ExtLib'] = modelDf['ExtLib']
    rf_explainer = shap.Explainer(random_forest)
    rf_shap_values = rf_explainer.shap_values(X_test, approximate=False, check_additivity=False)
    global_shap_values = rf_explainer.shap_values(X_train, approximate=False,
                                                  check_additivity=False)
    global_pos_shap_values = global_shap_values[1].tolist();
    global_neg_shap_values = global_shap_values[0].tolist();
    test['shapValues'] = rf_shap_values[1].tolist()
    test['comment_text']=comment_text
    expectedValue = rf_explainer.expected_value

    textCorrDF = test[['RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS', 'Sentiment', 'class']]
    heatmapDf = textCorrDF.corr()
    tex_cor_value = []
    for row, index in heatmapDf.iterrows():
        for i in index:
            tex_cor_value.append(i * 100)

    extCorrDF = test[['ACF', 'CT', 'TAC', 'RT', 'RCF', 'TRC', 'RP', 'ExtLib', 'class']]
    heatmapDf = extCorrDF.corr()
    ext_cor_value = []
    for row, index in heatmapDf.iterrows():
        for i in index:
            ext_cor_value.append(i * 100)

    return render_template('home.html',
                           df1=test[['id', 'RE', 'RENL', 'SWR', 'SKR', 'QR', 'CER', 'CS',
                                     'Sentiment', 'shapValues']].to_dict(
                               orient='records'),
                           df=modelDf[['id', 'RE', 'SWR', 'QR', 'CER', 'CS',
                                       'Sentiment']].to_dict(
                               orient='records'),
                           comment_text=comment_text,
                           normalizedExternalDf=normalizedExternalDf.to_dict(orient='records'),
                           tex_cor_value=tex_cor_value,
                           ext_cor_value=ext_cor_value,
                           y_pred=pred_result,
                           baseValue=expectedValue[1],
                           global_pos_shap_values=global_pos_shap_values,
                           global_neg_shap_values=global_neg_shap_values
                           )


if __name__ == '__main__':
    app.run()
