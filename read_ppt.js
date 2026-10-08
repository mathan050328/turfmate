/**
 * Read and print the text content from an existing PPTX file
 * by extracting the ZIP and reading the slide XML files.
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function readPptx(filePath) {
    const data = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(data);
    
    // Get all slide files
    const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml$/)).sort();
    
    console.log(`Found ${slideFiles.length} slides\n`);
    
    for (let i = 0; i < slideFiles.length; i++) {
        const slideFile = slideFiles[i];
        const content = await zip.files[slideFile].async('string');
        
        // Extract text from <a:t> tags
        const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
        const texts = textMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 0);
        
        console.log(`=== SLIDE ${i + 1} ===`);
        texts.forEach(t => console.log(`  "${t}"`));
        console.log('');
    }
}

readPptx('./old_presentation.pptx').catch(console.error);
