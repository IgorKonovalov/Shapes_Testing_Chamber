
var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

window.URL = (window.URL || window.webkitURL);

var prefix = {
  xmlns: "http://www.w3.org/2000/xmlns/",
  xlink: "http://www.w3.org/1999/xlink",
  svg: "http://www.w3.org/2000/svg"
};

let SVGSources = [],
    body = document.body;



let emptySvg = window.document.createElementNS(prefix.svg, 'svg');
emptySvg.setAttribute('class', 'displaynone');
window.document.body.appendChild(emptySvg);
var emptySvgDeclarationComputed = getComputedStyle(emptySvg);

function initiateDownload() {

  let documents = [window.document];

  documents.forEach(function(doc) {
    var newSources = getSources(doc, emptySvgDeclarationComputed);
    SVGSources = [];
    for (var i = 0; i < newSources.length; i++) {
      SVGSources.push(newSources[i]);
    }
  });
}


function getSources(doc, emptySvgDeclarationComputed) {
  var svgInfo = [],
      svgs = doc.querySelectorAll("svg");

  [].forEach.call(svgs, function (svg) {

    svg.setAttribute("version", "1.1");

    // removing attributes so they aren't doubled up
    svg.removeAttribute("xmlns");
    svg.removeAttribute("xlink");

    // These are needed for the svg
    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
      svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
    }

    if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
      svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
    }

    setInlineStyles(svg, emptySvgDeclarationComputed);

    var source = (new XMLSerializer()).serializeToString(svg);
    var rect = svg.getBoundingClientRect();
    svgInfo.push({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      class: svg.getAttribute("class"),
      id: svg.getAttribute("id"),
      childElementCount: svg.childElementCount,
      source: [doctype + source]
    });
  });
  return svgInfo;
}

function setInlineStyles(svg, emptySvgDeclarationComputed) {

  function explicitlySetStyle (element) {
    var cSSStyleDeclarationComputed = getComputedStyle(element);
    var i, len, key, value;
    var computedStyleStr = "";
    for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
      key=cSSStyleDeclarationComputed[i];
      value=cSSStyleDeclarationComputed.getPropertyValue(key);
      if (value!==emptySvgDeclarationComputed.getPropertyValue(key)) {
        computedStyleStr+=key+":"+value+";";
      }
    }
    element.setAttribute('style', computedStyleStr);
  }
  function traverse(obj){
    var tree = [];
    tree.push(obj);
    visit(obj);
    function visit(node) {
      if (node && node.hasChildNodes()) {
        var child = node.firstChild;
        while (child) {
          if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
            tree.push(child);
            visit(child);
          }
          child = child.nextSibling;
        }
      }
    }
    return tree;
  }
  // hardcode computed css styles inside svg
  var allElements = traverse(svg);
  var i = allElements.length;
  while (i--){
    explicitlySetStyle(allElements[i]);
  }
}

function download(source) {
  var filename = "untitled";

  if (source.id) {
    filename = source.id;
  } else if (source.class) {
    filename = source.class;
  } else if (window.document.title) {
    filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  }

  var url = window.URL.createObjectURL(new Blob(source.source, { "type" : "text\/xml" }));
  let prev = document.getElementsByClassName('svg-crowbar')[0];
  if (prev) {
    prev.remove();
  }

  var a = document.createElement("a");
  body.appendChild(a);
  a.setAttribute("class", "svg-crowbar");
  a.setAttribute("download", filename + ".svg");
  a.setAttribute("href", url);
  a.style["display"] = "none";
  a.click();

  setTimeout(function() {
    window.URL.revokeObjectURL(url);
  }, 10);
}
