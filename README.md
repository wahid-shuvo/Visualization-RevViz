# Visualization-RevViz
RevViz- A visualization tool for presenting code review comments
RevViz is a web-based tool that might help practitioners to explore the contribution and correlation among the different 
features of code review comments as well as the interpretation of the prediction model. It is implemented with HTML, CSS, 
Bootstrap, JavaScript D3 library for the front-end, and python for the server back-end.
The flask requires Python 3.7+

To run this project on your environment, please follow the below steps:
1. Download and unzip the project or clone the project.
2. Install python (the latest version is recommended however python version >3.7 is sufficient) on your computer.
3. Install the python flask package by using this command 'pip install flask'
4. Install the python pandas package by using this command 'pip install pandas
5. Install the SHAP package by using this command 'pip install shap'
6. From the root directory of the project you will find the 'app.py' file. Hence run this python file.
7. After running the 'app.py' python file, it will produce the local server link like this 'http://127.0.0.1:5000/'
8. Copy this link in your browser and visit this URL. It will take a while to load the page of ReVViz, since a huge computation happens in the background.

It will take around 2 minutes to load the project in the browser. Now you can explore the different functionality of ReViz.

To reproduce the result that reported in the final report, you can also execute the 'RevHelper-Evaluation.IPYNB' file from the src directory of this project.
