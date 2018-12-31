const vision = require('@google-cloud/vision');

let main = async () => {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const fileName = '/Users/franzih/Desktop/aoc.png';

    // // Performs text detection on the local file
    // const [result] = await client.textDetection(fileName);
    // const detections = result.textAnnotations;
    // console.log('Text:');
    // detections.forEach(text => console.log(text));


    // const [result] = await client.labelDetection(fileName);
    // const labels = result.labelAnnotations;
    // console.log('Labels:');
    // labels.forEach(label => console.log(label.description));


    // const [result] = await client.logoDetection(fileName);
    // const logos = result.logoAnnotations;
    // console.log('Logos:');
    // logos.forEach(logo => console.log(logo));

    const [result] = await client.documentTextDetection(fileName);
    const fullTextAnnotation = result.fullTextAnnotation;
    console.log(`Full text: ${fullTextAnnotation.text}`);
    fullTextAnnotation.pages.forEach(page => {
      page.blocks.forEach(block => {
        console.log(`Block confidence: ${block.confidence}`);
        block.paragraphs.forEach(paragraph => {
          console.log(`Paragraph confidence: ${paragraph.confidence}`);
          paragraph.words.forEach(word => {
            const wordText = word.symbols.map(s => s.text).join('');
            console.log(`Word text: ${wordText}`);
            console.log(`Word confidence: ${word.confidence}`);
            word.symbols.forEach(symbol => {
              console.log(`Symbol text: ${symbol.text}`);
              console.log(`Symbol confidence: ${symbol.confidence}`);
            });
          });
        });
      });
    });
}

main();