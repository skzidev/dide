/*
  DocsIDE / DIDE

  This is a script that turns Google Docs into an IDE.
  
  (This only works if the doc begins with "dide; ")

  Written by SKZI.
*/

function onOpen(){

  if(!currentDocument.getName().startsWith('dide; ')){
    return;
  }

  let currentDocument = DocumentApp.getActiveDocument();

  let settings = {[DocumentApp.Attribute.BACKGROUND_COLOR]: "#0b2942", [DocumentApp.Attribute.FONT_FAMILY]: 'Roboto Mono', [DocumentApp.Attribute.FOREGROUND_COLOR]: '#ffffff'};
  currentDocument.getBody().setAttributes(settings);

  let ui = DocumentApp.getUi();
  let menu = ui.createMenu('DocsIDE');
  menu.addItem("Run/Preview", 'run');
  menu.addItem('Export File', 'exportFile');
  menu.addSeparator();
  menu.addItem("Credits", 'credits');
  menu.addToUi();

  // Apply Syntax Highlighing. Also runs when document changes.
  // applySyntaxHighlighting();
}

function credits(){
  DocumentApp.getUi().alert("Created by SKZI.\nAvailable on GitHub at https://github.com/skzidev/dide");
}

function onInstall(){
  onOpen();
}
/*
function applySyntaxHighlighting(){
  let currentDocument = DocumentApp.getActiveDocument();
  let keyword = currentDocument.getBody().findText('void').getElement().setAttributes({[DocumentApp.Attribute.FOREGROUND_COLOR]: '#ff0000'});
}

function onEdit(){
  applySyntaxHighlighting();
}
*/

function run(){
  let currentDocument = DocumentApp.getActiveDocument();
  let name = currentDocument.getName();
  if(name.endsWith('html')){
    // Show as html
    let ui = DocumentApp.getUi().showSidebar(HtmlService.createHtmlOutput(currentDocument.getBody().getText()).setTitle("HTML Preview"));
  }
  else if(name.endsWith('js')){
    try {
      eval(currentDocument.getBody().getText());
    } catch(e){
      DocumentApp.getUi().alert('An Error Occured.', e.toString(), DocumentApp.getUi().ButtonSet.OK);
    }
  }
  else {
    DocumentApp.getUi().alert("This language is unsupported.\nCheck the GitHub Repo for more information.");
  }
}

function exportFile(){
  let currentDocument = DocumentApp.getActiveDocument();
  let html = HtmlService.createHtmlOutput(`
  <html>
    <body style="display:grid;height: 100vh;margin: 0;padding:0;">
      <button onclick="download()" style="border: none;font-family: monospace;padding: 5px;border-radius:5px;margin:auto;">Download File</button>
      <script>
        function download(){
          let content = \`${currentDocument.getBody().getText()}\`;
          let link = document.createElement('a');
          link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
          link.download = "${currentDocument.getName().replace('dide; ', '')}";
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      </script>
    </body>
  </html>
  `).setWidth(250).setHeight(100);
  DocumentApp.getUi().showModalDialog(html, "DIDE: Export File");
}

