# D3-Challenge-DOMAICA

## Main folder for solution is called: 'D3-Challenge-DOMAICA'

Inside that root folder, we can find 3 files:

- 'index.html' with code for the webpage for the project.
- 'README.md' -> Markdown with project explanation.
- 'README.pptx' -> Powerpoint containing screenshots, explaining process and main images of the outcomes, of webpages and additional details.

And 2 additional folders:

- 'assets'
- 'images'

### - Subfolder 'assets' contains:

- 'assets/data' subfolder which contains 2 files:

    - 'data.csv' (data) file with the sample statistical infos collected for the project that will be used to analyze and plot visualizations.

    - 'data_correlations.xlsx' (data) file with calculations of different correlation scenarios. It is stored in .xlsx format in spite of being based on data.csv because comma separated value files are not able to store formulas. To calculate correlations "CORREL" excel formula has been used for this exercise.
    
- 'assets/js' subfolder with and 'app.js' (coding) file invoked from html containing the javascript code.
  
- 'assets/css' subfolder which contains 2 files:  'd3Style.css'  and 'style.css'. Both files are .css Cascading Style Sheets used to adapt the presentation of webpage by modifying and enhancing colors, layouts, margin, fonts, etc.

### - Subfolder 'images' contains:

It contains some output images and gif.


### - Cross-origin resource sharing (CORS)

 CORS is a mechanism that restricts access to resources on a web page being requested from another domain outside the domain from which the first resource was served.
 
This project has been done by accessing the folder where "index.html" was located with command prompt, activate python and run the command 'python -m http.server'. This python command allows for separating Python code implementing an application’s logic from the HTML (or other) output that it produces. Therefore it lets us to work avoiding CORS security checks.

After running that command, you can access your webpage by browsing in 'localhost:8000' and see the results of your html and js development.

