const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const IMAGES_FILE = 'images.txt';

fs.writeFileSync(IMAGES_FILE, '')
get_images('output')

async function get_images( files_dir ){
    try {
        const files = await fs.promises.readdir( files_dir );
        for( const file of files ) {
            const current_file = path.join( files_dir, file );
            const stat = await fs.promises.stat( current_file );
            if( stat.isFile() ) {
                get_images_from_file(current_file);
            }
            else if( stat.isDirectory() ){
                get_images(current_file)
            }  
        } 
    }
    catch( e ) {
        console.error( "an erorr accured!", e );
    }
};


function get_images_from_file(file_name){
    console.log("getting all images from file: " + file_name)
    JSDOM.fromFile(file_name, {}).then(dom => {
        var images_list = [...dom.window.document.querySelectorAll('img')]
        images_list.forEach(function(item) {
            if (item.getAttribute('src')) {
            fs.appendFile(IMAGES_FILE, item.getAttribute('src') + '\n', (err) => {
                if (err) {
                  console.log(err);
                }})
        }})
    });
}