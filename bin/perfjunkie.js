// https://www.npmjs.com/package/perfjankie
const perfjankie = require('perfjankie');

let url = 'https://www.casual-fashion.com';


perfjankie({
    "url": url, // URL of the page that you would like to test.

    /* The next set of values identify the test */
    name: "Casual Fashion", // A friendly name for the URL. This is shown as component name in the dashboard
    time: new Date().getTime(), // Used to sort the data when displaying graph. Can be the time when a commit was made 
    run: "commit#Hash", // A hash for the commit, displayed in the x-axis in the dashboard 
    repeat: 3, // Run the tests 3 times. Default is 1 time 

    /* Identifies where the data and the dashboard are saved */
    couch: {
        server: 'http://localhost:5984',
        requestOptions : { "proxy" : "http://someproxy" }, // optional, e.g. useful for http basic auth, see Please check [request] for more information on the defaults. They support features like cookie jar, proxies, ssl, etc.
        database: 'performance',
        updateSite: !process.env.CI, // If true, updates the couchApp that shows the dashboard. Set to false in when running Continuous integration, run this the first time using command line.  
        onlyUpdateSite: false // No data to upload, just update the site. Recommended to do from dev box as couchDB instance may require special access to create views. 
    },

    callback: function(err, res) {
        // The callback function, err is falsy if all of the following happen 
        // 1. Browsers perf tests ran 
        // 2. Data has been saved in couchDB 
        // err is not falsy even if update site fails.  
    },

    /* OPTIONS PASSED TO BROWSER-PERF  */
    // Properties identifying the test environment */ 
    browsers: [{ // This can also be a ["chrome", "firefox"] or "chrome,firefox" 
        browserName: "chrome",
        version: 32,
        platform: "Windows 8.1"
    }], // See browser perf browser configuration for all options.

});