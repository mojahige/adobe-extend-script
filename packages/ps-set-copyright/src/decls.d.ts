declare const NewDocumentMode;
declare const DocumentFill;
declare const ElementPlacement;
declare const Units;
declare const OffsetUndefinedAreas;

type UnitValue = string;

type ElementPlacement = unknown;

interface ArtLayer {
  allLocked: boolean;
  isBackgroundLayer: boolean;
  name: string;
  bounds: UnitValue[],
  move: (
    relativeObject: ArtLayer | LayerSet,
    insertionLocation)
  => void;
  translate: (deltaX: number, deltaY: number) => void;
  applyOffset: (horizontal: UnitValue, vertical: UnitValue, undefinedAreas: OffsetUndefinedAreas);
}

interface ArtLayers {
  [key: number]: ArtLayer;
  length: number;
  parent: Document;
  typeName: String;
}

interface LayerSet {
  allLocked: boolean;
  artLayers: ArtLayers;
}

interface Layers {
  [key: number]: ArtLayer | LayerSet;
  length: number;
  parent: Document | LayerSet;
  typename: string;
}

interface Selection {
  copy: (merge?: boolean) => void;
  deselect: () => void;
  select: (
    region: number[],
    type: unknown,
    feather: number,
    antiAlias: boolean
  ) => void;
  selectAll: () => void;
}

interface Document {
  activeChannels: [];
  activeHistoryBrushSource: unknown;
  activeLayer: LayerSet | ArtLayer;
  width: UnitValue;
  height: UnitValue;
  selection: Selection;
  paste: () => ArtLayer;
  artLayers: ArtLayers;
  name: string; 
  layers: Layers;
}

type Documents = {
  [key: number]: Document;
  parent: App;
  length: number;
  typename: string;
  add: (
    width?: UnitValue,
    height?: UnitValue,
    resolution?: number,
    name?: string,
    mode?: unknown,
    initialFill?: unknown,
    pixelAspectRatio?: number,
    bitsPerChannel?: unknown,
    colorProfileName?: string
  ) => Document;
}

interface App {
  activeDocument: Document;
  documents: Documents;
  preferences: {
    rulerUnits: Units;
  };
}

declare var app: App;