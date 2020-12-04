interface DocumentData {
  copySourceDocument: Document | undefined;
  pasteToDocuments: Document[];
}

interface GenerateDocumentArguments {
  baseDocument: Document;
  sourceDocument: Document;
}

interface SplitFileNameResult {
  name: string | undefined;
  extension: string | undefined;
}

interface AddDocumentArguments {
  width: UnitValue;
  height: UnitValue;
  fileName: string;
  fileExtension: string | undefined;
}

interface MoveLayerArguments {
  document: Document;
  moveLayer: ArtLayer;
}

function splitToFileNameAndExtension(documentName: string): SplitFileNameResult {
  const result = documentName.split(/\.(?=[^.]+$)/)

  return {
    name: result[0],
    extension: result[1]
  }
}

function getDocument(): DocumentData {
  const documents = app.documents
  const copySourceImageIdentifierString = 'copyright'
  let copySourceDocument: Document | undefined = undefined
  let pasteToDocuments: Document[] = []

  for (let i = 0; i < documents.length; i++) {
    const { name } = documents[i]

    if (name.indexOf(copySourceImageIdentifierString) > -1) {
      copySourceDocument = documents[i]
    } else {
      pasteToDocuments.push(documents[i])
    }
  }

  return {
    copySourceDocument,
    pasteToDocuments
  }
}

function activateDocument(document: Document): void {
  app.activeDocument = document;
}

function selectionCopy(baseDocument: Document): void {
  activateDocument(baseDocument)

  if (
    (baseDocument.activeLayer as ArtLayer).isBackgroundLayer != undefined
  ) {
    (baseDocument.activeLayer as ArtLayer).isBackgroundLayer = false
  }
  
  baseDocument.activeLayer.allLocked = false
  baseDocument.selection.selectAll()
  baseDocument.selection.copy(true)
  baseDocument.selection.deselect()
}

function addDocument({
  width,
  height,
  fileName
}: AddDocumentArguments): Document {
  return app.documents.add(
    width,
    height,
    1.0,
    `${fileName}_modify`,
    NewDocumentMode.RGB,
    DocumentFill.TRANSPARENT
  )
}

function translateLayer({
  document,
  moveLayer
}: MoveLayerArguments): void {
  activateDocument(document)

  // const { width, height } = document;

  // Move the layer to the forefront
  moveLayer.move(
    document.layers[0],
    ElementPlacement.PLACEBEFORE
  )

  const [top, left] = moveLayer.bounds

  moveLayer.translate(0, 0)
}

function createNewDocument({
  baseDocument,
  sourceDocument
}: GenerateDocumentArguments) {
  const {
    name: baseDocumentName,
    width,
    height
  } = baseDocument;
  const {
    name: fileName,
    extension: fileExtension,
  } = splitToFileNameAndExtension(baseDocumentName)

  selectionCopy(baseDocument)

  const newDocument = addDocument({
    width,
    height,
    fileName,
    fileExtension
  })

  newDocument.paste()
  selectionCopy(sourceDocument)
  activateDocument(newDocument)

  const sourcePasteLayer = newDocument.paste()

  translateLayer({ document: newDocument, moveLayer: sourcePasteLayer })

  return newDocument;
}

function seve({
  baseDocument,
  sourceDocument
}: GenerateDocumentArguments): void {
  createNewDocument({ baseDocument, sourceDocument });
}

function generateNewImage({ copySourceDocument, pasteToDocuments }: DocumentData) {
  for (let i = 0; i < pasteToDocuments.length; i++) {
    seve({
      baseDocument: pasteToDocuments[i],
      sourceDocument: copySourceDocument
    })
  }
}

function run() {
  app.preferences.rulerUnits = Units.PIXELS;

  const { copySourceDocument, pasteToDocuments } = getDocument()

  if (copySourceDocument == undefined) {
    alert('🆖\nコピー元となるファイルが見つかりませんでした\n命名ルールについて確認してください🦖')
  }

  if (!pasteToDocuments.length) {
    alert('🆖\nペースト先のファイルが見つかりませんでした\nなんでだろ？\nファイルがなかったのかもしれないね🦖');
  }

  generateNewImage({ copySourceDocument, pasteToDocuments });
}

try {
  run();
} catch(error) {
  alert('💣\n予期せぬエラーが発生しました\n\n' + error)
}

