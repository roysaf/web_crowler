const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const path_pack = require( 'path' );
var argv = require('minimist')(process.argv.slice(2));

const { JSDOM } = jsdom;
const URL = argv.url
const depth = argv.depth

if (! URL) {
    console.error("no url provided")
    throw "no url provided"
}
scrape_web_page("output", URL, depth)

function scrape_web_page(source, url_to_fetch, depth=0){
    console.log("getting page from: " + url_to_fetch)
    got(url_to_fetch).then(response => {
    const dom = new JSDOM(response.body, {url: url_to_fetch});
    var files_path = create_dir_to_save(source, url_to_fetch)
    save_file(dom, files_path)
    if (depth > 0) {
    const urlList = [...dom.window.document.querySelectorAll('a')];
    urlList.filter(isHttp).forEach(link => {
        scrape_web_page(files_path, link.href, depth-1);
    });
    }
    }).catch(err => {
    console.log(err);
    });
}


function save_file(dom_obj, path) {
    file_name = path_pack.join(path, "html_file.html");
    // file_name = path + "/html_file.html"
    fs.writeFile(file_name ,dom_obj.window.document.documentElement.outerHTML, function(err) {
      if (err) throw err;
    });
}


function create_dir_to_save(source, url) {
    create_dir(source)
    var path = generate_dir_path(source, url)
    return create_dir(path);
}

function generate_dir_path(source, url){
    var path = url.replace("https://", "")
    path = path.replace("http://", "")
    path = path.split("/").join(".")
    if (source) {
        path = path_pack.join(source, path)
    }
    return path
}

const isHttp = (link) => {
    // Return false if there is no href attribute.
    if(typeof link.href === 'undefined') { return false }
  
    return link.href.includes('http');
  };
  

function create_dir(url) {
  var dir = url + "/"
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
}
  return dir
}