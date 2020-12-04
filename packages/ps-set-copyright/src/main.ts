function getDocument() {
  const documents = app.documents
  const copySourceImageIdentifierString = 'copyright'
  let copySourceDocument = undefined
  let pasteToDocuments = []

  for (var i = 0; i < documents.length; i++) {
    const { name, width, height } = documents[i]

    if (name.indexOf(copySourceImageIdentifierString) > -1) {
      copySourceDocument = documents[i]
    } else {
      pasteToDocuments.push(documents[i])
    }

    alert(`"${name}" size 👉 ${width} x ${height}` )
  }

  return {
    copySourceDocument,
    pasteToDocuments
  }
}

function run() {
  const { copySourceDocument, pasteToDocuments } = getDocument()

  console.log(copySourceDocument, pasteToDocuments)
}

run();
