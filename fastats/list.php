<!DOCTYPE html>
<!--
    http://vis.adjectivespecies.com - visualizations of the furry fandom.
    Copyright (C) 2012  Madison Scott-Clary

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<html>
    <head>
        <title>List FA Stats Users</title>
        <link rel="stylesheet" type="text/css" href="http://assets.adjectivespecies.com/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="/base.css" />
        <link rel="icon" type="image/png" href="http://assets.adjectivespecies.com/favicon.png" />
        <link rel="stylesheet" type="text/css" href="http://vis.mjs-svc.com/_lib/theme/css/smoothness/jquery-ui-1.8.6.custom.css" />
        <link rel="stylesheet" type="text/css" href="style.css" />
    </head>
    <body>
        <div class="topbar">
            <div class="topbar-inner">
                <div class="container-fluid">
                    <a class="brand" href="http://adjectivespecies.com">[adjective][species]</a>
                    <ul class="nav">
                        <li><a href="http://survey.adjectivespecies.com">Surveys</a></li>
                        <li class="active"><a href="http://vis.adjectivespecies.com">Visualizations</a></li>
                        <li><a href="http://forums.adjectivespecies.com">Forums</a></li>
                        <li><a href="http://twitter.com/adjspecies">Twitter</a></li>
                        <li><a href="http://furaffinity.net/user/adjspecies">FurAffinity</a></li>
                        <li><a href="https://plus.google.com/112736664779432876558?prsrc=3">Google+</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <header>
            <a href="http://adjectivespecies.com"><img src="http://assets.adjectivespecies.com/as-header.png" /></a>
        </header>
        <h1>List FA Stats Users</h1>
        <div id="vis">
            <ul>
<?php
if ($rawdir = opendir("raw")) {
    $i = 1;
    while (false !== ($file = readdir($rawdir))) {
        if ($file != "." && $file != "..") {
            echo '<li class="' . ($i % 2 == 0 ? "even" : "odd") . '"><a href="/fastats/?user=' . $file . "\">$file</a></li>\n";
            $i++;
        }
    }
    closedir($rawdir);
}

?>
            </ul>
            <p style="text-align: center">That's <? print $i - 1; ?> users!  I like the number <? print $i; ?> better, though, so make sure you <a href="submit.php">join up</a>!</p>
        </div>
        <footer>
            <a href="http://lib.jnsq.us/license/cc-by-nc-sa" target="_blank"><img src="http://lib.jnsq.us/licenses/small/by-nc-sa_inline.png" alt="CC BY-NC-SA (Attribution-NonCommercial-ShareAlike)" /> [adjective][species], 2012</a> under the CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) license
        </footer>
<!-- Piwik --> 
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "https://piwik.jnsq.us/" : "http://piwik.jnsq.us/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
    try {
        var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 9);
        piwikTracker.trackPageView();
        piwikTracker.enableLinkTracking();
    } catch( err ) {}
        </script><noscript><p><img src="http://piwik.jnsq.us/piwik.php?idsite=9" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tracking Tag -->
    </body>
</html>
