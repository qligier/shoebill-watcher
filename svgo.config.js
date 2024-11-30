export default {
  multipass: true,
  js2svg: {
    indent: 0,
    pretty: false,
  },
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'minifyStyles',
    'sortAttrs',
    'sortDefsChildren',
    "convertColors",
    "mergePaths",
    "removeDesc",
    "removeEmptyAttrs",
    "removeEmptyText",
    "removeEmptyContainers",
    "removeMetadata",
    "reusePaths",
    "mergeStyles",
    "minifyStyles",
    "minifyStyles",
    "convertPathData"
  ],
};