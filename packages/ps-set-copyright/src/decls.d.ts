interface App {
  activeDocument: { [key: string]: any };
  currentTool: string;
  documents: Array;
}
declare var app: App;