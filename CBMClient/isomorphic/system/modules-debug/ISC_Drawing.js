
/*

  SmartClient Ajax RIA system
  Version SNAPSHOT_v10.0d_2014-05-06/LGPL Deployment (2014-05-06)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_Drawing){isc.module_Drawing=1;isc._moduleStart=isc._Drawing_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Drawing load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;

if (window.isc && isc.version != "SNAPSHOT_v10.0d_2014-05-06/LGPL Deployment") {
    isc.logWarn("SmartClient module version mismatch detected: This application is loading the core module from "
        + "SmartClient version '" + isc.version + "' and additional modules from 'SNAPSHOT_v10.0d_2014-05-06/LGPL Deployment'. Mixing resources from different "
        + "SmartClient packages is not supported and may lead to unpredictable behavior. If you are deploying resources "
        + "from a single package you may need to clear your browser cache, or restart your browser."
        + (isc.Browser.isSGWT ? " SmartGWT developers may also need to clear the gwt-unitCache and run a GWT Compile." : ""));
}







//------------------------------------------------------------------------------------------
//  detect native drawing capabilities by browser version
//------------------------------------------------------------------------------------------
isc.Browser.hasCANVAS = isc.Browser.geckoVersion >= 20051107 || isc.Browser.safariVersion >= 181 ||
                        isc.Browser.isIE9 ||
                        (!isc.Browser.isIE && typeof(document.createElement("canvas").getContext) === "function");
isc.Browser.hasSVG = isc.Browser.geckoVersion >= 20051107; // || isc.Browser.safariVersion >= ???

isc.Browser.hasVML = isc.Browser.isIE && isc.Browser.version >= 5;
isc.Browser.defaultDrawingType =
                              //isc.Browser.hasSVG ? "svg" :
                              isc.Browser.hasCANVAS ? "bitmap" :
                              isc.Browser.hasVML ? "vml" :
                              "none";

isc._$xlinkNS = "http://www.w3.org/1999/xlink";
isc._$svgNS = "http://www.w3.org/2000/svg";

isc.defineClass("SVGStringConversionContext").addClassProperties({
    _$xlink: "xlink"
});
isc.SVGStringConversionContext.addProperties({
    _nextSvgDefNum: 1,

    //> @attr svgStringConversionContext.printForExport (Boolean : true : IR)
    // Whether the conversion to SVG source is being requested for print export.
    //<

    printForExport: true,

    xlinkPrefix: isc.SVGStringConversionContext._$xlink
});
isc.SVGStringConversionContext.addMethods({
    init : function () {
        this.Super("init", arguments);
        this.svgDefStrings = {};
    },

    getNextSvgDefNumber : function () {
        return this._nextSvgDefNum++;
    }
});

isc.defineClass("VMLStringConversionContext").addMethods({
    init : function () {
        this.Super("init");
        this.drawLabelsAccumulator = [];
    }
});

//------------------------------------------------------------------------------------------
//> @class DrawPane
//
// A DrawPane is a container for drawing bitmap and vector graphics using browser's built-in
// freeform drawing capabilities.  These include the HTML5 <code>&lt;canvas&gt;</code> tag and
// <code>SVG (Scalable Vector Graphics)</code> where available, and the <code>VML (Vector Markup
// Language)</code> for legacy browsers (Internet Explorer 8 and earlier).
// <p>
// To draw in a <code>DrawPane</code> you create +link{DrawLine}s, +link{DrawOval}s,
// +link{DrawPath}s and other +link{DrawItem}-based components, and place them in the
// <code>DrawPane</code> via +link{drawPane.drawItems} or add them incrementally via
// +link{drawPane.addDrawItem()}.
// <p>
// <code>DrawItems</code> support a variety of common features, such as
// +link{Gradient,gradient fills}, +link{drawItem.startArrow,arrowheads}, events such as
// +link{drawItem.click,click()} and built-in +link{drawItem.knobs,control knobs} for end user
// resizing and manipulation of shapes.
// <p>
// Common shapes such as +link{DrawRect,rectangles}, +link{DrawOval,ovals} and
// +link{DrawTriangle,triangles} have dedicated DrawItem subclasses.  For other shapes,
// consider:
// <ul>
// <li> +link{DrawPath} - a multi-segment line with straight segments, defined by a series
//      of +link{drawPath.points,points}
// <li> +link{DrawPolygon} - a closed shape with straight sides, defined by a series of
//      +link{drawPolygon.points,points}
// <li> +link{DrawShape} - a multi-segment line or closed shape whose sides can be defined by a
//      series of commands, including curved arcs
// </ul>
//
// <smartgwt><p><b>NOTE:</b>To use the Drawing subsystem, include the Drawing module
// in your application by including <code>&lt;inherits name="com.smartgwt.Drawing"/&gt;</code>
// in your GWT module XML.</p></smartgwt>
//
// <h3>Note on Coordinate Systems</h3>
// There are three different coordinate systems involved when a DrawItem is drawn onto a DrawPane:
// <ul>
// <li>The "local coordinate system" for a DrawItem refers to the Cartesian coordinate system
//     in which dimensional and positional values are interpreted.  For example, when a
//     +link{DrawRect} is configured with left:20, top:30, width:200, and height:100, the
//     DrawRect represents a rectangle from (20, 30) to (220, 130) in its local coordinate
//     system.
//     <p>
//     There is a local coordinate system for each DrawItem.</li>
// <li>The "drawing coordinate system" refers to the Cartesian coordinate system shared by
//     all DrawItems after their local transforms, such as +link{DrawItem.scale} or
//     +link{DrawItem.rotation}, have been applied.
//     <p>
//     For DrawItems with no local transforms, the drawing coordinate system is identical to
//     the local coordinate system.</li>
// <li>The "global coordinate system" refers to the drawing coordinate system with global
//     DrawPane transforms +link{DrawPane.translate}, +link{DrawPane.zoomLevel} and
//     +link{DrawPane.rotation} applied.
//     <p>
//     With the default global transforms, the global coordinate system is identical to the
//     drawing coordinate system.</li>
// </ul>
// <p>
// The view port of the DrawPane is the rectangle in the global coordinate system from (0, 0)
// that is as wide as the DrawPane's +link{Canvas.getInnerContentWidth(),inner content width}
// and as high as the DrawPane's +link{Canvas.getInnerContentHeight(),inner content height}.
// <p>
// One other coordinate system in use by a DrawPane when +link{DrawPane.canDragScroll,drag-scrolling}
// is enabled is the "viewbox coordinate system". The viewbox coordinate system is the drawing
// coordinate system with the +link{DrawPane.translate} and +link{DrawPane.zoomLevel} transforms
// applied.
//
// @inheritsFrom Canvas
// @treeLocation Client Reference/Drawing
// @visibility drawing
//<
//------------------------------------------------------------------------------------------



isc.defineClass("DrawPane", "Canvas").addProperties({

_radPerDeg: isc.Math._radPerDeg,

overflow: "hidden",

drawingType: isc.Browser.defaultDrawingType, // vml, bitmap, svg, none

//> @attr drawPane.drawingWidth (int : 1000 : IR)
// When +link{DrawPane.canDragScroll,canDragScroll} is enabled, this is the width of the area
// in viewbox coordinates that can be accessed through drag-scrolling.
// @example ZoomAndPan
// @visibility external
//<
drawingWidth: 1000,

//> @attr drawPane.drawingHeight (int : 1000 : IR)
// When +link{DrawPane.canDragScroll,canDragScroll} is enabled, this is the height of the area
// in viewbox coordinates that can be accessed through drag-scrolling.
// @example ZoomAndPan
// @visibility external
//<
drawingHeight: 1000,

//> @attr drawPane.precision (int : 3 : IRA)
// The minimum number of floating-point digits of coordinates that will be respected when the
// drawing commands are executed. This setting only has an effect in Internet Explorer 6-8.
//<
precision: 3,

//> @attr drawPane.canDragScroll (boolean : false : IR)
// Can the user drag-scroll the DrawPane?
// @see DrawPane.drawingWidth
// @see DrawPane.drawingHeight
// @example ZoomAndPan
// @visibility external
//<
canDragScroll: false,

dragAppearance:"none",

//> @attr drawPane.dragScrollCursor (Cursor : "all-scroll" : IRW)
// Cursor to switch to when +link{DrawPane.canDragScroll,canDragScroll} is true.
//<
dragScrollCursor: "all-scroll",

// allows the DrawPane to be placed above other widgets and not interfere with finding drop
// targets
isMouseTransparent: true,

//> @attr drawPane.rotation (float : 0 : IRW)
// Rotation in degrees for the <code>DrawPane</code> as a whole about the center of the
// <code>DrawPane</code>. The positive direction corresponds to clockwise rotation (for example,
// 45 is rotation clockwise by 45 degrees and -10 is rotation counterclockwise by 10 degrees).
//
// @visibility drawing
//<
rotation: 0,

//> @attr drawPane.zoomLevel (float : 1 : IRW)
// Zoom for the <code>DrawPane</code> as a whole, where 1 is normal size.
//
// @visibility drawing
//<
zoomLevel: 1,

//> @attr drawPane.translate (Array[] of int : null : IR)
// Global translation. This array has two numbers. The first number is the X translation amount
// in pixels and the second number is the Y translation amount in pixels.
// @visibility external
//<
translate: null,

//> @attr drawPane.gradients (Array of Gradient : null : IR)
// Array of gradients that can be referenced by DrawItems placed on this DrawPane.
// Each gradient must have an ID assigned to be used for reference.
//
// @visibility drawing
//<

// Do we support fractional coords? Depends on drawing type
supportsFractionalCoordinates : function () {

    var drawingType = this.drawingType;
    if (drawingType == "bitmap") return true;
    if (drawingType == "vml") return true;
    // Untested in svg
//    if (drawingType == "svg") return true;
    return false;
},

//> @attr drawPane.drawItems (Array of DrawItem : null : IR)
// Array of DrawItems to initially display in this DrawPane.
// @visibility drawing
//<


//canvasItems - array of Canvii that should be zoomed and panned with this DrawPane

//> @object ColorStop
// An object containing properties that is used in Gradient types
//
// @treeLocation Client Reference/Drawing/Gradients
// @visibility drawing
//<
//> @attr colorStop.offset (float: 0.0: IR)
// The relative offset for the color.
//
// @visibility drawing
//<
//> @attr colorStop.opacity (float: 1.0: IR)
// 0 is transparent, 1 is fully opaque
//
// @visibility drawing
//<
//> @attr colorStop.color (CSSColor: null: IR)
// eg #ff0000 or red or rgb(255,0,0)
//
// @visibility drawing
//<

//> @object Gradient
// Defines a simple gradient vertical gradient between +link{gradient.startColor,two}
// +link{gradient.endColor,colors}, or using +link{gradient.colorStops,colorStops}.  See
// +link{SimpleGradient}, +link{LinearGradient} and +link{RadialGradient} for further
// properties to define more advanced gradients.
//
// @treeLocation Client Reference/Drawing/Gradients
// @visibility drawing
//<
//> @attr gradient.id (identifier : null : IR)
// Identifier which can be used by one or more DrawItems when gradient is assigned
// to +link{drawPane.gradients}. The ID property is optional when gradient is assigned directly
// to a DrawItem.
// <p>
// The ID must be unique within DrawPane.gradients if defined.
// @visibility drawing
//<
//> @attr gradient.colorStops (Array of ColorStop: null: IR)
// An array of color stops for this gradient.
//
// @visibility drawing
//<
//> @attr gradient.startColor (CSSColor : null : IR)
// A start color for the gradient. If both startColor and +link{Gradient.endColor,endColor}
// are set then +link{Gradient.colorStops,colorStops} is ignored.
//
// @visibility drawing
//<
//> @attr gradient.endColor (CSSColor : null : IR)
// An end color for the gradient. If both +link{Gradient.startColor,startColor} and endColor
// are set then +link{Gradient.colorStops,colorStops} is ignored.
//
// @visibility drawing
//<

//> @object SimpleGradient
// Definition of a simple linear gradient defined by 2 colors and a +link{SimpleGradient.direction,direction}.
//
// @inheritsFrom Gradient
// @treeLocation Client Reference/Drawing/Gradients
// @visibility drawing
//<
//> @attr simpleGradient.direction (float : 0.0 : IR)
// Direction vector in degrees
//
// @visibility drawing
//<
//> @attr simpleGradient.startColor
// The start color of the gradient.
//
// @include Gradient.startColor
// @visibility drawing
//<
//> @attr simpleGradient.endColor
// The end color of the gradient.
//
// @include Gradient.endColor
// @visibility drawing
//<

//> @object LinearGradient
// Definition of a linear gradient between two points, (+link{LinearGradient.x1,x1}, +link{LinearGradient.y1,y1})
// and (+link{LinearGradient.x2,x2}, +link{LinearGradient.y2,y2}).
//
// @inheritsFrom Gradient
// @treeLocation Client Reference/Drawing/Gradients
// @visibility drawing
//<
//> @attr linearGradient.x1 (String : null : IR)
// X coordinate of the start point. This can be a number or a percentage of the width of the
// bounding box of the DrawItem to which it is applied.
//
// @visibility drawing
//<
//> @attr linearGradient.y1 (String : null : IR)
// Y coordinate of the start point. This can be a number or a percentage of the height of the
// bounding box of the DrawItem to which it is applied.
//
// @visibility drawing
//<
//> @attr linearGradient.x2 (String : null : IR)
// X coordinate of the end point. This can be a number or a percentage of the width of the
// bounding box of the DrawItem to which it is applied.
//
// @visibility drawing
//<
//> @attr linearGradient.y2 (String : null : IR)
// Y coordinate of the end point. This can be a number or a percentage of the height of the
// bounding box of the DrawItem to which it is applied.
//
// @visibility drawing
//<

//> @object RadialGradient
// Definition of a radial gradient.
//
// @inheritsFrom Gradient
// @treeLocation Client Reference/Drawing/Gradients
// @visibility drawing
//<
//> @attr radialGradient.cx (String: null: IR)
// x coordinate of outer radial
//
// @visibility drawing
//<
//> @attr radialGradient.cy (String: null: IR)
// y coordinate of outer radial
//
// @visibility drawing
//<
//> @attr radialGradient.r  (String: null: IR)
// radius
//
// @visibility drawing
//<
//> @attr radialGradient.fx (String: null: IR)
// x coordinate of inner radial
//
// @visibility drawing
//<
//> @attr radialGradient.fy (String: 0: IR)
// y coordinate of inner radial
//
// @visibility drawing
//<

//> @object Shadow
//A class used to define a shadow used in a Draw&lt;Shape&gt; Types.
//
// @treeLocation Client Reference/Drawing
// @visibility drawing
//<
//> @attr shadow.color (CSSColor: black: IR)
//
//@visibility drawing
//<
//> @attr shadow.blur (int: 10: IR)
//
//@visibility drawing
//<
//> @attr shadow.offset (Point: [0,0]: IR)
//
//@visibility drawing
//<

createQuadTree : function () {
    this.quadTree = isc.QuadTree.create({
        depth: 0,
        maxDepth: 50,
        maxChildren: 1
    });
    this.quadTree.bounds = {x:0,y:0,width:this.getInnerContentWidth(),height:this.getInnerContentHeight()};
    this.quadTree.root = isc.QuadTreeNode.create({
        depth: 0,
        maxDepth: 8,
        maxChildren: 4
    });
    this.quadTree.root.bounds = this.quadTree.bounds;
},

initWidget : function () {
    var precision = this.precision = Math.max(0, this.precision << 0);
    this._pow10 = Math.pow(10, precision);

    this._initGradients();
    if (this.drawingType == "svg") this._isLoaded = false;
    this.drawItems = this.drawItems || [];
    this.canvasItems = this.canvasItems || [];
    this.createQuadTree();
    for (var i = 0; i < this.drawItems.length; i++) {
        this.addDrawItem(this.drawItems[i]);
    }
    for (var i = 0; i < this.canvasItems.length; i++) {
        this.addCanvasItem(this.canvasItems[i]);
    }

    // don't redraw with SVG or VML or we'll wipe out the DOM elements DrawItems use
    this.redrawOnResize = (this.drawingType=="bitmap");

    this._viewPortWidth = this.getInnerContentWidth();
    this._viewPortHeight = this.getInnerContentHeight();

    // initialize internal viewbox properties
    this._viewBoxLeft = this.translate == null ? 0 : this.translate[0];
    this._viewBoxTop = this.translate == null ? 0 : this.translate[1];
    this._viewBoxWidth = this._viewPortWidth / this.zoomLevel;
    this._viewBoxHeight = this._viewPortHeight / this.zoomLevel;

    if (isc.Browser.isIE && this.drawingType == "vml") {
        document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            this.startTagVML = function (tagName) {
                return '<rvml:' + tagName + ' class="rvml" ';
            };
            this.endTagVML = function (tagName) {
                return '</rvml:' + tagName + '>';
            };

        } catch (e) {
            this.startTagVML = function (tagName) {
                return '<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml" ';
            };
            this.endTagVML = function (tagName) {
                return '</rvml:' + tagName + '>';
            };
        }
    }
},
_initGradients : function () {
    this._gradientMap = {};

    if (!this.gradients) return;
    if (!isc.isAn.Array(this.gradients)) this.gradients = [this.gradients];

    for (var i = 0; i < this.gradients.length; i++) {
        var gradient = this.gradients[i];
        if (!gradient.id) {
            isc.logWarn("Gradient provided in DrawPane.gradients does not have an ID - ignored");
            continue;
        }
        if (!gradient._constructor) gradient._constructor = isc.DrawItem._getGradientConstructor(gradient);

        if (this._gradientMap[gradient.id] != null) {
            isc.logWarn("Duplicate gradient with ID " + gradient.id + " - replacing previous gradient");
        }
        this._gradientMap[gradient.id] = gradient;
    }
},

_toVMLCoord : function (value) {
    return (value * this._pow10) << 0;
},

// Convert coordinates in the global coordinate system to drawing coordinates.
normalize : function (x, y) {
    var inverseTransform = this._inverseTransform,
        transform = this._getGlobalTransform();
    if (inverseTransform == null || transform != this._inverseInverseTransform) {
        inverseTransform = this._inverseTransform = transform.getInverse();
        this._inverseInverseTransform = transform;
    }
    return inverseTransform.transform(x, y);
},

// Event handling logic


getDrawItem : function (pageX, pageY, seekingHoverTarget) {
    // Convert page coordinates to coordinates in the global coordinate system.
    var pageOffsets = this.getPageOffsets();
    var x = pageX - (pageOffsets.left + this.getLeftMargin() + this.getLeftBorderSize() + this.getLeftPadding());
    var y = pageY - (pageOffsets.top + this.getTopMargin() + this.getTopBorderSize() + this.getTopPadding());

    // Convert global coordinates to drawing coordinates.
    var normalized = this.normalize(x, y);
    x = normalized.v0;
    y = normalized.v1;
    var items = this.quadTree.retrieve({ x: x, y: y });



    // We need to traverse from last to first so that an event will be handled by top drawItem
    // when there are several items drawn above one another.
    var itemsLength = (items ? items.length : 0),
        blockingGroup = null;
    for (var i = itemsLength; i--; ) {
        var item = items[i].item || items[i],
            shape = item.shape;
        if ((seekingHoverTarget &&
             (shape.canHover === false || (shape.canHover == null && shape.prompt == null))) ||
            shape.hidden)
        {
            continue;
        }

        var inItem = shape.isPointInPath(x, y, pageX, pageY);




        var blockedByGroup = false;
        for (var dg = shape.drawGroup; !blockedByGroup && dg != null; dg = dg.drawGroup) {

            if (dg.useGroupRect && dg.isInBounds(x, y)) {
                blockedByGroup = true;
                blockingGroup = dg;
            }
        }
        if (blockedByGroup) {

            continue;
        }

        if (inItem) {
            return shape;
        }
    }
    return blockingGroup;
},

getEventTarget : function (scEvent) {

//     this.logDebug("getEventTarget firing:" + scEvent.eventType + " at " +
//                  [scEvent.x,scEvent.y], "drawEvents");
    switch(scEvent.eventType) {
        case 'mouseUp':
        case 'mouseDown':
        case 'mouseMove':
        case 'mouseOut':
        case 'mouseOver':
        case 'click':
        case 'contextMenu':
            var item = this.getDrawItem(scEvent.x,scEvent.y);
            if (item != null) return item;
        default:
    }
    return this;
},

getHoverTarget : function (scEvent) {
    var item = this.getDrawItem(scEvent.x, scEvent.y, true);
    if (item != null) return item;
    return this.Super("getHoverTarget", arguments);
},

_updateCursor : function (drawItem) {
    var currentCursor = null;
    if (drawItem != null) {
        currentCursor = drawItem.getCurrentCursor();
    }
    if (currentCursor == null) currentCursor = this.canDragScroll ? this.dragScrollCursor : this.getCurrentCursor();
    this._applyCursor(currentCursor);
},

prepareForDragging: function () {
    // This event will bubble. If a child has already set up EH.dragTarget no need to
    // attempt to assign to an item.
    if (!isc.EH.dragTarget) {
        var item = this.getDrawItem(isc.EH.lastEvent.x, isc.EH.lastEvent.y);
        if (item != null && item.canDrag) {
            isc.EH.dragTarget = item;
            isc.EH.dragOperation = "drag";
            return true;
        } else if (this.canDragScroll) {
            isc.EH.dragTarget = this;
            isc.EH.dragOperation = isc.EH.DRAG_SCROLL;
            return true;
        }
    }
    // If the user isn't attempting to drag a specific item, call Super() to allow standard Canvas
    // drag behavior.
    return this.Super("prepareForDragging", arguments);
},


dropMove : function () {},

clear : function () {
    this.Super("clear", arguments);
    // wipe the "_drawn" flag from our draw items
    // if we are drawn again, we'll call 'draw()' on each item to re-show as part of drawChildren()

    if (this.drawItems != null) {
        for (var i = 0, len = this.drawItems.length; i < len; ++i) {
            var drawItem = this.drawItems[i];
            drawItem._clearEventParent();
            drawItem._drawn = false;
        }
    }
    if (this.drawingType == "bitmap") {
        this._bitmapContext = null; // clear the cached bitmap context handle
    }
},

// private method for quadtree debug
drawBounds : function(node) {
    isc.DrawRect.create({
      autoDraw:true,
      drawPane:this,
      left:Math.round(node.bounds.x),
      top:Math.round(node.bounds.y-node.bounds.height),
      width:Math.round(node.bounds.width),
      height:Math.round(node.bounds.height)
    },{
      lineColor:"#FF0000",
      lineOpacity:0.1,
      lineWidth:1,
      linePattern:"solid"
    });
    if(node.nodes && node.nodes.length) {
        for(var i = 0; i < node.nodes.length; ++i) {
          this.drawBounds(node.nodes[i]);
        }
    }
},

//> @method drawPane.erase()
// Call +link{DrawItem.erase()} on all DrawItems currently associated with the DrawPane.
// <P>
// The DrawItems will continue to exist, and you can call draw() on them to make them appear again, or
// +link{drawItem.destroy,destroy} to get rid of them permanetly.  Use +link{destroyItems()} to permanently
// get rid of all DrawItems.
//
// @visibility drawing
//<


erase : function (destroy, willRedraw) {
    if (willRedraw == undefined) {
        willRedraw = true;
        this._maybeScheduleRedrawTEA();
    }
    if (destroy) {
        isc.Log.logDebug("Destroying drawItems for DrawPane " + this.ID, "drawing");
        for (var i = 0; i < this.drawItems.length; i++) {
            this.drawItems[i].destroy(true, willRedraw); // pass destroyingAll flag to prevent extra redraws
        }
    } else if (this.isDrawn()) {
        for (var i = 0; i < this.drawItems.length; i++) {
            this.drawItems[i].erase(true, willRedraw); // pass erasingAll flag to prevent extra redraws
        }
    }
    if (willRedraw) this._erasedGradients = this._gradientMap;
    this.gradients = null;
    this._gradientMap = {};
    // clearing this.drawItems ensures they won't be drawn again if this pane is clear()ed and
    // draw()n again.
    if (willRedraw) this._erasedDrawItems = this.drawItems;
    this.drawItems = [];
    this._eventOnlyDrawItems = null;
    delete this._delayedDrawItems;
    this.canvasItems = [];
    this.createQuadTree();
    if (this.drawingType == "bitmap") this.redrawBitmap();
},

//> @method drawPane.destroyItems()
// Permanently +link{drawItem.destroy,destroy} all DrawItems currently associated with this DrawPane,
// leaving the DrawPane itself intact
// @visibility drawing
//<
destroyItems : function () {
    this.erase(true);
},

destroy : function () {
    this.Super("destroy", arguments);
    for (var i = 0; i < this.drawItems.length; i++) {
        this.drawItems[i].destroy();
    }
},

//> @method drawPane.addDrawItem()
// Add a drawItem to this drawPane (if necessary removing it from any other drawPanes)
// @param item (DrawItem) drawItem to add
// @param autoDraw (boolean) If explicitly set to false, and this drawPane is drawn, don't draw
//   the newly added item
// @visibility drawing
//<
addDrawItem : function (item, autoDraw, skipContainsCheck) {



    if (item.drawGroup != null) {
        item.drawGroup.removeDrawItem(item);

    // Remove the item from an existing DrawPane.
    // We want addDrawItem() to move the item to the front.  This allows the stack order of the
    // draw items to be corrected if other draw items are added, but `item' needs to remain
    // on top.
    } else if (!skipContainsCheck && item.drawPane != null) {

        // If the item's DrawPane is this DrawPane, we now know that `this.drawItems' does not
        // contain the item.
        if (item.drawPane == this) {
            // The item will be readded to the end of the drawItems array later in this method.
            this.drawItems.remove(item);

            skipContainsCheck = true;

        // Hide the item's knobs since it's being moved from a different DrawPane.
        } else {
            item.drawPane.removeDrawItem(item);

            if (item.knobs != null && !item.knobs.isEmpty()) item.knobs.map(item._hideKnobs, item);
        }
    }
    item.drawPane = this;

    if (autoDraw == null) autoDraw = true;

    // Table of actions:
    // +----------+----------------+---------------------------+
    // | autoDraw | this.isDrawn() | Action                    |
    // +----------+----------------+---------------------------+
    // |    T     |       T        | item.draw()               |
    // |    T     |       F        | add to this.drawItems     |
    // |    F     |       T        | (no action as documented) |
    // |    F     |       F        | add to this.drawItems     |
    // +----------+----------------+---------------------------+
    if (!this.isDrawn()) {
        if (skipContainsCheck || !this.drawItems.contains(item)) {
            this.drawItems.add(item);
            item._drawKnobs();
        }
        this.shouldDeferDrawing(item);
    } else if (autoDraw && !item._drawn) {
        // just call draw on the item to plug it into this.drawItems and render it out.
        item.draw();
    }
},

// Adds a DrawItem to this DrawPane for the purpose of having it participate in event handling
// only. The DrawItem will not be drawn.
_addEventOnlyDrawItem : function (item) {
    if (this._eventOnlyDrawItems == null) this._eventOnlyDrawItems = [item];
    else this._eventOnlyDrawItems.add(item);
},

// removeDrawItem() - erase the item and remove from this.drawItems / clear up the item.drawPane
// pointer back to this.
// Currently used only by addDrawItem to clear up any previous drawPane the item pointed to.
removeDrawItem : function (item) {
    if (item.drawPane != this) return;
    if (item._drawn) {
        item.erase();
    } else {
        this.drawItems.remove(item);
    }
    item.drawPane = null;
},

// Override Canvas.getTransformCSS() so that an initial rotation value is not applied as a CSS
// transform to the DrawPane's handle. We'll handle DrawPane.rotation ourselves, depending on
// drawingType.
getTransformCSS : function () {
    return null;
},

getInnerHTML : function () {


    var type = this.drawingType;
    if (type === "vml") {
        // Would be nice to write out the VML behavior definition here, but the style block is
        // not parsed when drawn into a canvas after page load? if there is some way to do this,
        // the style definition is <style>VML\:* {behavior:url(#default#VML);}</style>
        // For now, just writing an outermost group that we can use for zoom and pan. Note
        // that this group needs a unique ID, since multiple DrawPanes may be instantiated on
        // the same page.
        // NB: need to at least wipe out the &nbsp, which pushes all shapes right by a few pixels
        // TODO/TEST - IIRC VML is supposed to define an implicit viewbox, but experts on MSDN
        //  articles have said that it is unpredictable, so we explicitly set it to the available
        //  space in the drawpane here. A 1-1 mapping of screen pixels and vector coordinates will
        //  limit precision/resolution of scalable drawings, though. We might want to set a
        //  higher resolution coordsize here and apply scaling to all drawing operations, not sure,
        //  but something to keep in mind if we see scaling artifacts or other pixel-level
        //  problems. For some more info on the coordinate space, see:
        //  http://msdn.microsoft.com/en-us/library/bb250511.aspx
        return (

                this.startTagVML('RECT') + " ID='" +
                this.getID() + "_vml_eventmask' style='position:absolute;top:0px;left:0px;width:100%;height:100%;' stroked='false' fillcolor='#ff00ff'>" +
                    this.startTagVML('FILL') + " on='true' opacity='0' />" +
                this.endTagVML('RECT') +

                this.startTagVML('GROUP') + " ID='" +
                this.getID() + "_vml_box' STYLE='position:absolute;" +
                "left:" + (this._viewBoxLeft - this.scrollLeft + this.getLeftPadding()) +
                "px;top:" + (this._viewBoxTop - this.scrollTop + this.getTopPadding()) +
                "px;width:" + this._viewPortWidth +
                "px;height:" + this._viewPortHeight +
                "px;rotation:" + (this.rotation) +
                ";' coordsize='" + this._viewBoxWidth + ", " + this._viewBoxHeight +
                "' coordorig='0 0'>" +
                this.endTagVML('GROUP')
            );

    } else if (type === "bitmap") {
        return isc.SB.concat(
            "<CANVAS ID='", this.getID(), "_bitmap' ",
                "WIDTH='", this._viewPortWidth, "' ",
                "HEIGHT='", this._viewPortHeight, "' ",
                "STYLE='display:block' dir='ltr'>",
            "</CANVAS>"); // Firefox *requires* a closing CANVAS tag
    } else if (type === "svg") {
        // iframed svg document
        this._isLoaded = false;
        return "<IFRAME HEIGHT='100%' WIDTH='100%' SCROLLING='NO' FRAMEBORDER='0' SRC='" +
            isc.Page.getHelperDir() + "DrawPane.svg?isc_dp_id=" + this.getID() +"'></IFRAME>"
    } else {
        this.logWarn("DrawPane getInnerHTML: '" + type + "' is not a supported drawingType");
        return this.Super("getInnerHTML", arguments);
        // TODO implement alternate rendering/message when no drawing technology is available
    }
},

_handleResized : function () {
    this._updateViewPort();
},

//> @method drawPane.getDataURL()
// Get a "data:" URL encoding the current contents of the DrawPane as a PNG file.
// <p>
// The returned "data:" URLs can be used anywhere a URL to an image is valid, for example,
// +link{Img.src}.
// <p>
// This method will directly return the data URL on modern browsers when using &lt;canvas&gt;-style
// rendering (the default).
// <p>
// On legacy browers (any version of IE in "quirks" mode, all versions of IE prior to 9.0), data
// URL generation requires a server trip and requires the SmartClient Server to be installed with
// the same set of +link{group:javaModuleDependencies,required .jars} as are required for PDF
// export of charts in legacy IE.  The method will return null and a callback must be passed,
// which fires when the data URL has been retrieved from the server.
// <p>
// If the callback is passed but no server trip is required, the callback is fired immediately.
// <p>
// For obtaining PNG or other image data for use in server-side processing (such as attaching to
// automated emails or saving to a database), see also the server-side APIs in
// com.isomorphic.contentexport.ImageExport.
//
// @param [callback] (DataURLCallback) callback to fire when data url is available
// @return (String) the data URL (on modern browsers)
// @example chartImageExport
// @visibility drawing
//<
getDataURL : function (callback) {
    if (this.drawingType == "bitmap") {
        var canvas = document.getElementById(this.getID() + "_bitmap");
        if (canvas != null && !!canvas.toDataURL) {
            var dataURL;
            try {
                // "When a user agent is to create a serialization of the bitmap as a file,
                // optionally with some given arguments, and optionally with a native flag set,
                // it must create an image file in the format given by the first value of arguments,
                // or, if there are no arguments, in the PNG format."
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#a-serialization-of-the-bitmap-as-a-file
                dataURL = canvas.toDataURL();

            // HTMLCanvasElement.toDataURL() will throw a SecurityError if the canvas' origin-clean
            // flag is set to false.
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-canvas-todataurl
            } catch (e) {
                this._logWarn("HTMLCanvasElement.toDataURL() threw an exception: " + e);
                dataURL = null;
            }

            if (dataURL != null &&
                dataURL.startsWith("data:image/png") &&
                (dataURL[14] === "," || dataURL[14] === ";"))
            {
                if (callback) this.fireCallback(callback, "dataURL", [dataURL]);
                return dataURL;
            }
        }
    }

    if (callback) {
        var requestProperties = {
            exportDisplay: "return"
        };
        var self = this;
        isc.RPCManager.exportImage(this.getSvgString(), requestProperties, function (imageData) {
            self.fireCallback(callback, "dataURL", ["data:image/png;base64," + imageData]);
        });
    }

    return null;
},

//> @method Callbacks.DataURLCallback
// Callback for +link{drawPane.getDataURL()}.
// @param dataURL (String) the data URL
// @visibility external
//<


measureLabel : function (text, labelProps) {
    if (text == null) text = "";
    else text = String(text);

    if (!labelProps) labelProps = {};
    var fontFamily = labelProps.fontFamily || isc.DrawLabel.getInstanceProperty("fontFamily"),
        fontWeight = labelProps.fontWeight || isc.DrawLabel.getInstanceProperty("fontWeight"),
        fontSize = labelProps.fontSize || isc.DrawLabel.getInstanceProperty("fontSize"),
        fontStyle = labelProps.fontStyle || isc.DrawLabel.getInstanceProperty("fontStyle");
    var cacheKey = fontSize + ":" + fontWeight + ":" + fontStyle + ":" + fontFamily + ":" + text;
    var cache;
    if (cache = this._measureLabelCache) {
        if (cache.hasOwnProperty(cacheKey)) return cache[cacheKey];
    } else cache = this._measureLabelCache = {};

    var measureCanvas = isc.DrawPane._getMeasureCanvas();

    var styleStr = "font-family:" + fontFamily + ";font-weight:" + fontWeight +
        ";font-size:" + fontSize + "px;font-style:" + fontStyle + ";white-space:nowrap";
    var contents = "<span style='" + styleStr + "'>" + text.asHTML() + "</span>";

    measureCanvas.setContents(contents);
    measureCanvas.redraw("label measurement: " + text);
    var spanEl = measureCanvas.getHandle().firstChild;

    var dims = {
        width: spanEl.offsetWidth,
        height: spanEl.offsetHeight
    };
    //isc.logWarn("measureLabel:" + this.echoFull(dims) +
    //            "\ncontent:" + measureCanvas.getContents());
    return (cache[cacheKey] = dims);
},

//> @method drawPane.getSvgString()
// Converts this DrawPane to the source of an <code>&lt;svg&gt;</code> element equivalent to the
// current drawing.
// <p>
// In Pro edition and above, the returned string can be used with
// +link{RPCManager.exportImage()} to download an image, or with server-side APIs in
// com.isomorphic.contentexport.ImageExport to obtain various kinds of images for further
// server-side processing.
//
// @return (String) the source of an <code>&lt;svg&gt;</code> element.
// @example chartImageExport
// @visibility drawing
//<
getSvgString : function (conversionContext) {
    var width = this.getWidth(), height = this.getHeight(),
        rotation, center, widthP = width, heightP = height;

    var clipHandle = this.getClipHandle();
    var borderWidths = isc.Element.getBorderSizes(clipHandle);

    // When the drawing is rotated, the width and height of the <svg> element need to be set to
    // `widthP` and `heightP`, the width and height of the bounding box of a rectangle rotated
    // `this.rotation` degrees and having width `this.getWidth()` and height `this.getHeight()`.
    if (this.rotation && (center = this.getCenter()) && center.length == 2) {
        rotation = ((this.rotation % 360) + 360) % 360;


        var phi = rotation * this._radPerDeg,
            s = Math.abs(Math.sin(phi)),
            c = Math.abs(Math.cos(phi));
        widthP = width * c + height * s;
        heightP = width * s + height * c;
    }

    conversionContext = conversionContext || isc.SVGStringConversionContext.create();
    conversionContext.xlinkPrefix = conversionContext.xlinkPrefix || isc.SVGStringConversionContext._$xlink;
    var finalWidth = widthP + borderWidths.right + borderWidths.left,
        finalHeight = heightP + borderWidths.top + borderWidths.bottom;
    var padding = (this.padding == undefined ? 0 : parseFloat(this.padding));
    if (this.drawingType != "svg") {
        finalWidth -= padding;
        finalHeight -= padding;
    }
    var svgString = "<svg xmlns='" + isc._$svgNS +
        "' xmlns:" + conversionContext.xlinkPrefix + "='" + isc._$xlinkNS +
        "' width='" + finalWidth + "px" +
        "' height='" + finalHeight + "px" +
        "' viewBox='0 0 " + finalWidth + " " + finalHeight +
        "' version='1.1" +
        "'><metadata><!-- Generated by SmartClient " + isc.version + " --></metadata>";
    if (this.backgroundColor != null) {
        svgString += "<rect x='0' y='0' width='" + finalWidth +
            "' height='" + finalHeight +
            "' stroke='none' fill='" + this.backgroundColor + "'/>";
    }
    svgString += "<g transform='translate(" + ((widthP - width) / 2 + padding + borderWidths.left) + " " + ((heightP - height) / 2 + padding + borderWidths.top) + ") scale(" + this.zoomLevel + ")";
    if (rotation) {
        svgString += " rotate(" + rotation + " " + center[0] + " " + center[1] + ")";
    }
    svgString += "'><svg width='" + width + "' height='" + height + "'>";
    if (this.drawItems && this.drawItems.length) {
        svgString += "<g id='isc_svg_box";
        svgString += "'>";
        for (var i = 0; i < this.drawItems.length; ++i) {
            svgString += this.drawItems[i].getSvgString(conversionContext);
        }
        svgString += "</g>";
        if (conversionContext.svgDefStrings) {
            svgString += "<defs id='isc_svg_defs'>";
            for (var id in conversionContext.svgDefStrings) {
                if (conversionContext.svgDefStrings.hasOwnProperty(id)) svgString += conversionContext.svgDefStrings[id];
            }
            svgString += "</defs>";
        }
    }
    svgString += "</svg></g>";

    // Draw the borders
    var borderStyles = {
        Top: isc.Element.getComputedStyleAttribute(clipHandle, "borderTopStyle"),
        Right: isc.Element.getComputedStyleAttribute(clipHandle, "borderRightStyle"),
        Bottom: isc.Element.getComputedStyleAttribute(clipHandle, "borderBottomStyle"),
        Left: isc.Element.getComputedStyleAttribute(clipHandle, "borderLeftStyle")
    };
    var borderColors = {
        Top: isc.Element.getComputedStyleAttribute(clipHandle, "borderTopColor"),
        Right: isc.Element.getComputedStyleAttribute(clipHandle, "borderRightColor"),
        Bottom: isc.Element.getComputedStyleAttribute(clipHandle, "borderBottomColor"),
        Left: isc.Element.getComputedStyleAttribute(clipHandle, "borderLeftColor")
    };
    var strokeDasharrayAttr, xOffset, yOffset;
    // As a special exception, if all four borders are the same, then output a <rect> element.
    if (borderWidths.Top == borderWidths.Right &&
        borderWidths.Right == borderWidths.Bottom &&
        borderWidths.Bottom == borderWidths.Left &&

        borderStyles.Top == borderStyles.Right &&
        borderStyles.Right == borderStyles.Bottom &&
        borderStyles.Bottom == borderStyles.Left &&

        borderColors.Top == borderColors.Right &&
        borderColors.Right == borderColors.Bottom &&
        borderColors.Bottom == borderColors.Left)
    {
        if (borderWidths.Top) {
            strokeDasharrayAttr = null;
            if (borderStyles.Top == "solid") strokeDasharrayAttr = "";
            else if (borderStyles.Top == "dashed") strokeDasharrayAttr = " stroke-dasharray='5,5'";
            else if (borderStyles.Top == "dotted") strokeDasharrayAttr = " stroke-dasharray='1.5,2'";

            if (strokeDasharrayAttr != null && borderColors.Top) {
                yOffset = xOffset = borderWidths.Top / 2;
                svgString += "<rect x='" + xOffset +
                    "' y='" + yOffset +
                    "' width='" + (finalWidth - borderWidths.Top) +
                    "' height='" + (finalHeight - borderWidths.Top) +
                    "' stroke='" + borderColors.Top +
                    "' stroke-width='" + borderWidths.Top + "px'" +
                    strokeDasharrayAttr + " fill='none'/>";
            }
        }
    } else {
        var dirs = [ "Left", "Bottom", "Right", "Top" ],
            borderWidth, borderStyle, borderColor, x, y;
        for (var i = 0; i < dirs.length; ++i) {
            var dir = dirs[i];
            borderWidth = borderWidths[dir];
            if (borderWidth) {
                borderStyle = borderStyles[dir];
                strokeDasharrayAttr = null;
                if (borderStyle == "solid") strokeDasharrayAttr = "";
                else if (borderStyle == "dashed") strokeDasharrayAttr = " stroke-dasharray='5,5'";
                else if (borderStyle == "dotted") strokeDasharrayAttr = " stroke-dasharray='1.5,2'";

                if (strokeDasharrayAttr != null) {
                    borderColor = borderColors[dir];
                    if (borderColor) {
                        if (dir == "Left") {
                            x = borderWidth / 2;
                            yOffset = borderWidth / 2;
                            svgString += "<line x1='" + x +
                                "' y1='" + yOffset +
                                "' x2='" + x +
                                "' y2='" + (finalHeight - yOffset);
                        } else if (dir == "Bottom") {
                            xOffset = borderWidth / 2;
                            y = finalHeight - borderWidth / 2;
                            svgString += "<line x1='" + xOffset +
                                "' y1='" + y +
                                "' x2='" + (finalWidth - xOffset) +
                                "' y2='" + y;
                        } else if (dir == "Right") {
                            x = finalWidth - borderWidth / 2;
                            yOffset = borderWidth / 2;
                            svgString += "<line x1='" + x +
                                "' y1='" + yOffset +
                                "' x2='" + x +
                                "' y2='" + (finalHeight - yOffset);
                        } else { // dir == "Top"
                            xOffset = borderWidth / 2;
                            y = borderWidth / 2;
                            svgString += "<line x1='" + xOffset +
                                "' y1='" + y +
                                "' x2='" + (finalWidth - xOffset) +
                                "' y2='" + y;
                        }

                        svgString += "' stroke='" + borderColor +
                            "' stroke-width='" + borderWidth + "px'" +
                            strokeDasharrayAttr + "/>";
                    }
                }
            } // end if (borderWidth)
        }
    }

    svgString += "</svg>";
    return svgString;
},

//> @method drawPane.getPrintHTML() [A]
// Retrieves printable HTML for this component and all printable subcomponents.
// <P>
// By default any Canvas with children will simply collect the printable HTML of its
// children by calling getPrintHTML() on each child that is considered
// +link{canvas.shouldPrint,printable}.
// <P>
// If overriding this method for a custom component, you should <b>either</b> return a String of
// printable HTML string directly <b>or</b> return null, and fire the callback (if provided)
// using +link{Class.fireCallback}.
// <P>
// To return an empty print representation, return an empty string ("") rather than null.
// <P>
// The <code>printProperties</code> argument, if passed, must be passed to any subcomponents on
// which <code>getPrintHTML()</code> is called.
// <P>
// <b>Notes on printing</b>
// <P>
// To print a <code>DrawPane</code> for export on IE8 and earlier, it is important to pass
// +link{PrintProperties} with +link{PrintProperties.printForExport,printForExport}:true:
// <smartclient>
// <pre>var exportHTML = drawPane.getPrintHTML({ printForExport:true });</pre>
// </smartclient><smartgwt>
// <pre>final PrintProperties pp = new PrintProperties();
//pp.setPrintForExport(true);
//final String exportHTML = drawPane.getPrintHTML(pp, null);</pre>
// </smartgwt>
// @include method:canvas.getPrintHTML()
// @group printing
// @visibility external
//<
getPrintHTML : function (printProperties, callback) {
    if (this.drawingType == "bitmap") {
        var canvas = document.getElementById(this.getID() + "_bitmap");
        var ret = "<img src='" + canvas.toDataURL();

        if (printProperties && printProperties.printForExport) {
            ret += "' style='width:" + this.getWidth() + "px;max-width:100%";
        } else {
            ret += "' width='" + this.getWidth() + "' height='" + this.getHeight();
        }
        ret += "'/>";
        return ret;
    } else if (this.drawingType == "vml") {
        if (printProperties && printProperties.printForExport) return this.getSvgString();
        var vml_box = document.getElementById(this.getID() + "_vml_box");
        // Enclose the vml box in a relative tag so it'll flow correctly in the document

        return "<div style='position:relative;width:" + this.getInnerContentWidth() +
                    ";height:" + this.getInnerContentHeight() +
                    ";'>" + vml_box.parentElement.innerHTML + "</div>";
    } else if (this.drawingType == "svg") {
        return this.getSvgString();
    } else {
        return "";
    }
},

_batchDraw : function (drawItems) {

    if (drawItems == null) drawItems = [];
    else if (!isc.isAn.Array(drawItems)) drawItems = [drawItems];

    if (this.drawingType == "svg") {
        if (!this._svgDocument) return;

        var conversionContext = isc.SVGStringConversionContext.create({ printForExport: false });
        var beforeSvgString = "",
            afterSvgString = "";
        for (var i = 0; i < drawItems.length; i++) {
            var drawItem = drawItems[i];
            if (drawItem._svgHandle) drawItem._svgHandle.parentNode.removeChild(drawItem._svgHandle);
            var svgString = drawItem.getSvgString(conversionContext);
            if (drawItem.drawToBack) beforeSvgString += svgString;
            else afterSvgString += svgString;
        }

        var defsSvgString = "";
        for (var defID in conversionContext.svgDefStrings) {
            if (conversionContext.svgDefStrings.hasOwnProperty(defID) && !this._svgDocument.getElementById(defID)) {
                var defSvgString = conversionContext.svgDefStrings[defID];

                defsSvgString += defSvgString;
            }
        }

        var svgContainer = this._svgDocument.getElementById("isc_svg_box");
        if (!isc.Browser.isWebKit) {
            var range = this._svgDocument.createRange();
            range.setStart(this._svgDefs, 0);
            this._svgDefs.appendChild(range.createContextualFragment(defsSvgString));


            range.setStart(svgContainer, 0);
            svgContainer.insertBefore(range.createContextualFragment(beforeSvgString), svgContainer.firstChild);


            svgContainer.appendChild(range.createContextualFragment(afterSvgString));
        } else {
            // WebKit browsers throw DOM error 9 NOT_SUPPORTED_ERR upon invocation of Range.createContextualFragment()
            // for Ranges created by the SVG document. A work-around is to use the DOMParser API.
            // See:  http://code.google.com/p/chromium/issues/detail?id=107982
            var domParser = new DOMParser();
            var parsedDoc = domParser.parseFromString("<svg xmlns='" + isc._$svgNS + "' xmlns:" + conversionContext.xlinkPrefix + "='" + isc._$xlinkNS + "'>" +
                                                        "<defs>" + defsSvgString + "</defs>" +
                                                        "<g>" + beforeSvgString + "</g>" +
                                                        "<g>" + afterSvgString + "</g>" +
                                                      "</svg>", "image/svg+xml");
            var svgElem = parsedDoc.documentElement;
            var beforeElementsContainerElem = this._svgDocument.importNode(svgElem.childNodes.item(1), true);
            var afterElementsContainerElem = this._svgDocument.importNode(svgElem.childNodes.item(2), true);
            var defsContainerElem = this._svgDocument.importNode(svgElem.childNodes.item(0), true);
            svgElem = null;
            parsedDoc = null;

            var child;
            while (child = defsContainerElem.firstChild) {
                this._svgDefs.appendChild(child);
            }

            var svgContainerFirstChild = svgContainer.firstChild;
            while (child = beforeElementsContainerElem.firstChild) {
                svgContainer.insertBefore(child, svgContainerFirstChild);
            }

            while (child = afterElementsContainerElem.firstChild) {
                svgContainer.appendChild(child);
            }
        }

        for (var i = 0; i < drawItems.length; i++) {
            var drawItem = drawItems[i];
            drawItem.drawPane = this;
            drawItem.drawingSVG = true;
            drawItem._svgDocument = this._svgDocument;
            drawItem._svgContainer = svgContainer;
            drawItem._svgHandle = this._svgDocument.getElementById("isc_DrawItem_" + drawItem.drawItemID);
            drawItem._setupEventParent();
            drawItem._drawn = true;
        }
    } else if (this.drawingType == "bitmap") {
        this.redrawBitmapNow(true);
    } else {
        var beforeVMLString = "",
            afterVMLString = "",
            conversionContext = isc.VMLStringConversionContext.create();
        for (var i = 0; i < drawItems.length; ++i) {
            var drawItem = drawItems[i];
            if (drawItem._vmlHandle != null) {
                if (drawItem._vmlHandle.parentNode != null) drawItem._vmlHandle.parentNode.removeChild(drawItem._vmlHandle);
                drawItem._vmlContainer = null;
                drawItem._vmlHandle = null;
                drawItem._vmlStrokeHandle = null;
                drawItem._vmlFillHandle = null;
                drawItem._vmlTextHandle = null;
            }
            var vmlElem = drawItem._getElementVML("isc_DrawItem_" + drawItem.drawItemID, conversionContext);
            if (drawItem.drawToBack) beforeVMLString = vmlElem + beforeVMLString;
            else afterVMLString += vmlElem;
        }

        var vmlContainer = isc.Element.get(this.getID() + "_vml_box");
        vmlContainer.insertAdjacentHTML("afterbegin", beforeVMLString);
        vmlContainer.insertAdjacentHTML("beforeend", afterVMLString);

        // Go through drawLabelsAccumulator.
        var drawLabelsAccumulator = conversionContext.drawLabelsAccumulator;
        if (drawLabelsAccumulator != null && drawLabelsAccumulator.length > 0) {
            beforeVMLString = "";
            afterVMLString = "";
            for (var i = 0; i < drawLabelsAccumulator.length; ++i) {
                var drawLabel = drawLabelsAccumulator[i];

                // This time, do not pass the conversionContext. This is how DrawLabel knows to
                // return the <DIV> markup.
                var vmlElem = drawLabel._getElementVML("isc_DrawItem_" + drawLabel.drawItemID);
                if (drawLabel.drawToBack) beforeVMLString = vmlElem + beforeVMLString;
                else afterVMLString += vmlElem;
            }

            vmlContainer = this.getHandle();
            vmlContainer.insertAdjacentHTML("afterbegin", beforeVMLString);
            vmlContainer.insertAdjacentHTML("beforeend", afterVMLString);
        }

        for (var i = 0; i < drawItems.length; ++i) {
            var drawItem = drawItems[i];
            drawItem.drawPane = this;
            drawItem.drawingVML = true;
            drawItem._setupEventParent();
            drawItem._drawn = true;
        }
    }

    this._setupEventOnlyDrawItems();


},

_setupEventOnlyDrawItems : function () {
    var eventOnlyDrawItems = this._eventOnlyDrawItems;
    if (eventOnlyDrawItems != null) {
        for (var i = 0, l = eventOnlyDrawItems.length; i < l; ++i) {
            eventOnlyDrawItems[i]._setupEventParent();
        }
    }
},

//> @method drawPane.isBatchDrawing()
// Determines whether this DrawPane is in batch drawing mode.
//
// @return (Boolean) whether this DrawPane is in batch drawing mode.
// @visibility internal
//<

isBatchDrawing : function () {
    return this._batchDrawing > 0;
},

_isBatchDrawing : function () {
    return (this._batchDrawing > 0 ||
            // might as well be in batch drawing mode if the redraw TEA is scheduled because
            // drawn DrawItems are just going to be redrawn anyway.
            this._isRedrawTEAScheduled() ||
            this._isLoaded === false) &&
           this._endingBatchDrawing !== true;
},

//> @method drawPane.beginBatchDrawing()
// Begins batching the drawing of DrawItems that have been added to this DrawPane so that all drawing
// of DrawItems can be done at the same time. If this DrawPane is already in batch drawing mode, then
// calling this method has no effect.
//
// <p><b>NOTE:</b> For batch drawing to work properly, each call to beginBatchDrawing() must be matched
// by a corresponding call to +link{DrawPane.endBatchDrawing()}.
//
// <p>Consider using batch drawing when several DrawItems are going to be drawn in a single thread of execution.
// This can be an important optimization in that scenario, especially when using the SVG drawing back-end.
// The SVG back-end benefits from batch drawing by being able to utilize the browser's native SVG parser to parse and insert
// the SVG elements all at once rather than resorting to calling a multitude of DOM operations to
// draw each DrawItem.
//
// @visibility internal
//<


beginBatchDrawing : function () {
    this._batchDrawing = (this._batchDrawing || 0) + 1;
},

//> @method drawPane.endBatchDrawing()
// Ends batching the drawing of DrawItems.
//
// @visibility internal
//<

endBatchDrawing : function (immediate) {
    if (!this.isBatchDrawing()) this.logWarn("Not in batch drawing mode. Exiting.");
    this._endBatchDrawing(immediate);
},

_endBatchDrawing : function (immediate) {
    if (!this._isBatchDrawing() || (this._batchDrawing > 0 && --this._batchDrawing > 0)) return;

    if (immediate == true && !this._isBatchDrawing()) {
        this.refreshNow();
    } else this._maybeScheduleRedrawTEA();
},

//> @method drawPane.refreshNow() [A]
// Immediately draws any DrawItems that have been added to a drawing batch.
//
// @visibility internal
//<
refreshNow : function () {
    this._endingBatchDrawing = true;
    this._batchDraw(this._delayedDrawItems);
    delete this._delayedDrawItems;
    this._endingBatchDrawing = false;
},

// Override drawChildren to render out our drawItems
drawChildren : function () {
    this.Super("drawChildren", arguments);
    if (!this._isBatchDrawing()) {
        for (var i = 0; i < this.drawItems.length; i++) {
            var drawItem = this.drawItems[i];
            drawItem.draw();
        }
    }
},

getBitmapContext : function () {
    var bitmapContext = this._bitmapContext;
    if (bitmapContext == null) {
        var bitmapHandle = this.getDocument().getElementById(this.getID() + "_bitmap");
        if (!bitmapHandle) {
            this.logWarn("DrawPane failed to get CANVAS element handle");
            return;
        }
        bitmapContext = this._bitmapContext = bitmapHandle.getContext("2d");
        if (!bitmapContext) {
            this.logWarn("DrawPane failed to get CANVAS 2d bitmap context");
            return;
        }
    } else {
        // Reset the saved context's transform to the identity transform.
        bitmapContext.setTransform(1, 0, 0, 1, 0, 0);
    }
    return bitmapContext;
},

redraw : function (reason) {
    // in Canvas mode, redraw the <canvas> tag to resize it
    if (this.drawingType == "bitmap") {
        // do normal redraw to resize the <canvas> element in our innerHTML
        this.Super("redraw", arguments);
        this._bitmapContext = null; // clear the cached bitmap context handle
        if (!this._isRedrawTEAScheduled()) this.redrawBitmapNow();
    }
    // otherwise ignore: don't want to lose the SVG or VML DOM
},

_isRedrawTEAScheduled : function () {
    return this._redrawTEAScheduled == true ||
           (this.drawingType == "bitmap" && this._redrawPending);
},

_maybeScheduleRedrawTEA : function () {
    if (!this._isRedrawTEAScheduled()) {
        if (this.drawingType == "bitmap") this.redrawBitmap();
        else {
            var self = this;
            isc.EH._setThreadExitAction(function () {
                self._redrawTEA();
            });
            this._redrawTEAScheduled = true;
            this._ranRedrawTEA = false;
        }
    }
},

_redrawTEA : function () {
    if (this._ranRedrawTEA !== false) return;
    this._ranRedrawTEA = true;

    if (this._erasedDrawItems) {
        for (var i = 0; i < this._erasedDrawItems.length; ++i) {
            var erasedDrawItem = this._erasedDrawItems[i];
            if (erasedDrawItem._erasedSVGHandle) {
                erasedDrawItem._erasedSVGHandle.parentNode.removeChild(erasedDrawItem._erasedSVGHandle);
                delete erasedDrawItem._erasedSVGHandle;
            }
        }
        delete this._erasedDrawItems;
    }
    if (this._erasedGradients) {
        if (this.drawingType == "svg" && this._svgDocument) {
            for (var gradientID in this._erasedGradients) {
                if (!this._erasedGradients.hasOwnProperty(gradientID)) continue;
                var svgDef = this._erasedGradients[gradientID]._svgDef;
                if (!svgDef) svgDef = this._svgDocument.getElementById(gradientID);

                if (svgDef) {
                    svgDef.parentNode.removeChild(svgDef);

                    gradientID = svgDef.getAttributeNS(isc._$xlinkNS, "href");
                    if (gradientID && gradientID.charAt(0) == '#') gradientID = gradientID.substring(1);
                    if (gradientID) {
                        svgDef = this._svgDocument.getElementById(gradientID);
                        if (svgDef) svgDef.parentNode.removeChild(svgDef);
                    }
                }
            }
        }
        delete this._erasedGradients;
    }

    this._endingBatchDrawing = true;
    this._batchDraw(this.drawItems);
    this._endingBatchDrawing = false;

    this._redrawTEAScheduled = false;
},


redrawBitmap : function () {
    // defer redraw until end of current thread
    if (this._redrawPending) return;
    this._redrawPending = true;
    var self = this;
    isc.EH._setThreadExitAction(function () {
        if (!self._redrawPending) return;
        self.redrawBitmapNow();
    });
},

// @return (AffineTransform)
_getGlobalTransform : function () {
    var t = this._transform;
    if (t != null) return t;

    t = isc.AffineTransform.create();
    if (this.translate) {
        t.translate(this.translate[0] - this.scrollLeft, this.translate[1] - this.scrollTop);
    } else {
        t.translate(-this.scrollLeft, -this.scrollTop);
    }
    t.scale(this.zoomLevel, this.zoomLevel);
    if (this.rotation) {
        t.rotate(this.rotation, this._viewPortWidth / 2, this._viewPortHeight / 2);
    }
    return (this._transform = t);
},

redrawBitmapNow : function (skipSetupEventOnlyDrawItems) {
    this._redrawPending = false;


    var delayedDrawItems = this._delayedDrawItems;
    if (delayedDrawItems != null) {

        for (var i = delayedDrawItems.length; i--; ) {
            var item = delayedDrawItems[i];
            if (!this.shouldDeferDrawing(item)) {
                delayedDrawItems.remove(item);
            }
            item.draw();
        }
    }

    if (!this.isDrawn()) return; // clear()d during redraw delay

    var context = this.getBitmapContext();
    if (!context) return; // getBitmapContext has already logged this error

    context.clearRect(0, 0, this._viewPortWidth, this._viewPortHeight);

    // apply global translation, zoomLevel, and rotation
    var t = this._getGlobalTransform();
    context.setTransform(t.m00, t.m10, t.m01, t.m11, t.m02, t.m12);

    // this loop is duplicated in drawGroup.drawBitmap() to render nested drawItems
    for (var i=0; i<this.drawItems.length; i++) {
        var drawItem = this.drawItems[i];
        drawItem.drawingBitmap = true;
        if (!drawItem.hidden) {
            drawItem.drawBitmap(context);
            drawItem._setupEventParent();
            drawItem._drawn = true;
        }
    }

    if (!skipSetupEventOnlyDrawItems) this._setupEventOnlyDrawItems();
},

//> @method drawPane.drawing2screen() (A)
// Converts drawing coordinates to global coordinates, accounting for global zoom and pan.
// Takes and returns a rect in array format [left, top, width, height].
// Use this to synchronize non-vector elements (eg Canvii that provide interactive hotspots;
// DIVs that render text for VML DrawPanes) with the vector space.
// <P>
// <i>NB: this takes drawing coordinates; be sure to convert from local
//     (DrawGroup translation hierarchy) coordinates first if necessary</i>
// @param drawingRect (array) 4 element array specifying drawing coordinates in format
//                  <code>[left, top, width, height]</code>
// @return (array) 4 element array specifying screen coordinates, in format
//                  <code>[left, top, width, height]</code>
//<
drawing2screen : function (drawRect) {
    return [
        Math.round(drawRect[0] * this.zoomLevel + this._viewBoxLeft - this.scrollLeft + this.getLeftPadding()),
        Math.round(drawRect[1] * this.zoomLevel + this._viewBoxTop - this.scrollTop + this.getTopPadding()),
        Math.round(drawRect[2] * this.zoomLevel),
        Math.round(drawRect[3] * this.zoomLevel)];
},

//> @method drawPane.screen2drawing() (A)
// Converts screen coordinates to drawing coordinates, accounting for global zoom and pan.
// Takes and returns a rect in array format [left, top, width, height].
// Use this to map screen events (eg on transparent Canvas hotspots) into the vector space.
// <P>
// <i>NB: this returns drawing coordinates; be sure to convert to local
//     (DrawGroup translation hierarchy) coordinates if necessary</i>
// @param screenRect (array) 4 element array specifying screen coordinates in format
//                  <code>[left, top, width, height]</code>
// @return (array) 4 element array specifying drawing coordinates, in format
//                  <code>[left, top, width, height]</code>
//<
screen2drawing : function (screenRect) {
    //!DONTOBFUSCATE
    return [
        (screenRect[0] - this.getLeftPadding() + this.scrollLeft - this._viewBoxLeft) / this.zoomLevel,
        (screenRect[1] - this.getTopPadding() + this.scrollTop - this._viewBoxTop) / this.zoomLevel,
        screenRect[2] / this.zoomLevel,
        screenRect[3] / this.zoomLevel];
},

// Define the region within the drawing space (the "viewbox") that should be scaled to fit in the
// current visible area (the "viewport"), effectively panning and/or zooming the drawPane.
// zoom() and pan() call through this method to get the job done.
_viewBoxUpdated : function () {
    this._viewBoxLeft = this.translate == null ? 0 : this.translate[0];
    this._viewBoxTop = this.translate == null ? 0 : this.translate[1];
    this._viewBoxWidth = this._viewPortWidth / this.zoomLevel;
    this._viewBoxHeight = this._viewPortHeight / this.zoomLevel;

    if (!this.isDrawn()) return;

    // Update items and item properties that should not be affected by the viewbox/global transformations,
    // or that need to be corrected because of the viewbox transformation.
    this._updateItemsToViewBox();

    // Update the viewbox/global transforms.
    var type = this.drawingType;
    if (type === "vml") {
        var vmlBox = this._vmlBox;
        if (this.vmlBox == null) {
            vmlBox = this._vmlBox = this.getDocument().getElementById(this.getID() + "_vml_box");
        }
        if (vmlBox != null) {
            vmlBox.style.left = (this._viewBoxLeft - this.scrollLeft) + this.getLeftPadding() + this._$px;
            vmlBox.style.top = (this._viewBoxTop - this.scrollTop) + this.getTopPadding() + this._$px;
            vmlBox.coordsize.x = this._viewBoxWidth;
            vmlBox.coordsize.y = this._viewBoxHeight;
            vmlBox.style.rotation = this.rotation == null ? "" : this.rotation;
        }
    } else if (type === "svg") {
        if (this._svgBox != null) {
            var t = this._getGlobalTransform();
            this._svgBox.setAttributeNS(null, "transform", "matrix(" + t.m00 + " " + t.m10 + " " + t.m01 + " " + t.m11 + " " + t.m02 + " " + t.m12 + ")");
        }
    } else {

        this.redrawBitmap();
    }
},

_updateViewPort : function () {
    var width = this.getInnerContentWidth(),
        height = this.getInnerContentHeight();

    this._viewPortWidth = width;
    this._viewPortHeight = height;
    this.scrollLeft = Math.max(0, Math.min(this.scrollLeft, this.getScrollRight()));
    this.scrollTop = Math.max(0, Math.min(this.scrollTop, this.getScrollBottom()));
    this._viewBoxWidth = width / this.zoomLevel;
    this._viewBoxHeight = height / this.zoomLevel;

    if (!this.isDrawn()) return;

    this._updateItemsToViewBox();

    var type = this.drawingType;
    if (type === "vml") {
        var vmlBox = this._vmlBox;
        if (this.vmlBox == null) {
            vmlBox = this._vmlBox = this.getDocument().getElementById(this.getID() + "_vml_box");
        }
        if (vmlBox != null) {
            vmlBox.style.width = width + this._$px;
            vmlBox.style.height = height + this._$px;
            vmlBox.coordsize.x = this._viewBoxWidth;
            vmlBox.coordsize.y = this._viewBoxHeight;
        }
    } else if (type === "svg") {
        if (this._svgBody != null) {
            this._svgBody.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
        }
    } else {

        var canvas = this.getDocument().getElementById(this.getID() + "_bitmap");
        if (canvas != null) {
            canvas.width = width;
            canvas.height = height;
        }
        this.redrawBitmap();
    }
},

// Embed a canvas in this DrawPane, so it zooms/pans/clips in synch with shapes in the vector space.
// We assume that the original rect (left/top/width/height properties) of this canvas has been
// set in drawing coordinates, so we apply the current zoom and pan immediately.
// TODO support canvasItems in drawGroups
// TODO patch coordinate setters (setLeft, moveBy, etc) so they work with drawing coords?
//      or implement setDrawingLeft(), etc?
//      Currently we've worked around a single case: In DrawKnobs we supply a custom
//      setCenterPoint() method which can take drawing OR screen coordinates.
//
// NOTE: Any Canvas can be added to a drawPane as a canvasItem (it's not a custom Canvas class, and
// doesn't necessarily have any associated content rendered out as drawItems.
// By adding a canvas to a drawPane as a canvasItem you're essentially
// just causing the canvas to be notified when the drawPane zooms / pans.

addCanvasItem : function (item) {
    // crosslink
    this.canvasItems.add(item);
    item.drawPane = this;
    // save original position and size settings
    item._drawingLeft = item.left;
    item._drawingTop = item.top;
    item._drawingWidth = item.width;
    item._drawingHeight = item.height;
    // add as child, for local coordinates and clipping
    this.addChild(item);
    // update for current zoom & pan
    this._updateCanvasItemToViewBox(item);

    return item;
},

_getSimpleGradientSvgString : function (id, simpleGradient, conversionContext, drawItem) {
    return this._getLinearGradientSvgString(id, {
        id: simpleGradient.id,
        direction: simpleGradient.direction,
        colorStops: [{
            color: simpleGradient.startColor,
            offset: 0.0
        }, {
            color: simpleGradient.endColor,
            offset: 1.0
        }]
    }, conversionContext, drawItem);
},


_getLinearGradientSvgString : function (id, linearGradient, conversionContext, drawItem) {
    var svgDefStrings = conversionContext.svgDefStrings || (conversionContext.svgDefStrings = {}),
        baseGradientID = id;
    if (!svgDefStrings[baseGradientID]) {
        var svg = isc.SB.create();
        svg.append("<linearGradient id='", baseGradientID, "'>");
        if (linearGradient.startColor != null && linearGradient.endColor != null) {
            svg.append(
                "<stop stop-color='", linearGradient.startColor, "' offset='0' stop-opacity='1'/>",
                "<stop stop-color='", linearGradient.endColor, "' offset='1' stop-opacity='1'/>");
        } else if (isc.isAn.Array(linearGradient.colorStops)) {
            for (var i = 0; i < linearGradient.colorStops.length; ++i) {
                var colorStop = linearGradient.colorStops[i],
                opacity = colorStop.opacity || "1";
                svg.append(
                    "<stop stop-color='", colorStop.color,
                    "' offset='", colorStop.offset,
                    "' stop-opacity='", opacity, "'/>");
            }
        }
        svg.append("</linearGradient>");
        svgDefStrings[baseGradientID] = svg.toString();
    }

    id = "gradient" + conversionContext.getNextSvgDefNumber();
    drawItem._useGradientID = id;
    var xlinkPrefix = (conversionContext.xlinkPrefix||isc.SVGStringConversionContext._$xlink),
        vector = drawItem._normalizeLinearGradient(linearGradient);
    return isc.SB.concat(
        "<linearGradient id='", id,
        "' ", xlinkPrefix, ":href='#", baseGradientID,
        "' x1='", vector[0],
        "' y1='", vector[1],
        "' x2='", vector[2],
        "' y2='", vector[3],
        "' gradientUnits='userSpaceOnUse'/>");
},


_getRadialGradientSvgString : function (id, radialGradient, conversionContext, drawItem) {
    var svgDefStrings = conversionContext.svgDefStrings || (conversionContext.svgDefStrings = {}),
        baseGradientID = id,
        svgString,
        xlinkPrefix = conversionContext.xlinkPrefix || isc.SVGStringConversionContext._$xlink;
    if (!svgDefStrings[baseGradientID]) {
        svgString = "<radialGradient id='" + baseGradientID;
        if (radialGradient._baseGradient != null) {
            var baseGradientID2, baseGradient;
            if (isc.isA.String(radialGradient._baseGradient)) {
                baseGradientID2 = radialGradient._baseGradient;
                baseGradient = this._gradientMap[baseGradientID2];
            } else {
                baseGradient = radialGradient._baseGradient;
                baseGradientID2 = baseGradient.id;
            }
            if (!svgDefStrings[baseGradientID2]) {
                svgDefStrings[baseGradientID2] = this._getRadialGradientSvgString(baseGradientID2, baseGradient, conversionContext);
            }
            svgString += "' " + xlinkPrefix + ":href='#" + baseGradientID2;
        }
        svgString += "'>";
        if (radialGradient.colorStops != null) {
            for (var i = 0; i < radialGradient.colorStops.length; ++i) {
                var colorStop = radialGradient.colorStops[i],
                    opacity = colorStop.opacity || "1";
                svgString += "<stop stop-color='" + colorStop.color + "' offset='" + colorStop.offset + "' stop-opacity='" + opacity + "'/>";
            }
        }
        svgString += "</radialGradient>";
        svgDefStrings[baseGradientID] = svgString;
    }

    if (drawItem != null) {
        id = "gradient" + conversionContext.getNextSvgDefNumber();
        drawItem._useGradientID = id;
        var vector = drawItem._normalizeRadialGradient(radialGradient);
        svgString = "<radialGradient id='" + id +
                "' " + xlinkPrefix + ":href='#" + baseGradientID;
        if (radialGradient.cx != null) svgString += "' cx='" + vector[0];
        if (radialGradient.cy != null) svgString += "' cy='" + vector[1];
        if (radialGradient.fx != null) svgString += "' fx='" + vector[3];
        if (radialGradient.fy != null) svgString += "' fy='" + vector[4];
        if (radialGradient.r != null) svgString += "' r='" + vector[5];
        svgString += "' gradientUnits='userSpaceOnUse'/>";
    }

    return svgString;
},

_getFilterSvgString : function (id) {
    if (id == "isc_ds1") {
        return "<filter id='isc_ds1'><feOffset result='offOut' in='SourceAlpha' dx='2.4' dy='2.4'/><feGaussianBlur result='blurOut' in='offOut' stdDeviation='1.8'/><feColorMatrix result='cmatOut' in='blurOut' type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.8 0'/><feBlend in='SourceGraphic' in2='cmatOut' mode='normal'/></filter>";
    }
    return null;
},


// move and scale an associated canvas to match the current drawPane zoom & pan
// called when a canvasItem is added to this drawPane, and when the drawPane is zoomed or panned
// will also need to call this when a canvasItem is moved or resized
_updateCanvasItemToViewBox : function (item) {
    // synchingToPane flag - This is required for DrawKnobs - it essentially notifies the
    // canvas that the drawItem (the knobShape) doesn't need to be moved in response to the
    // canvas move.
    item.synchingToPane = true;
    item.setRect(this.drawing2screen([
        item._drawingLeft,
        item._drawingTop,
        item._drawingWidth,
        item._drawingHeight
    ]));
    // HACK also scale border width, assuming uniform px borders all around
    // TODO consider how to structure this via shared CSS classes for faster updates
    // Note: we could get the initial border width from parseInt(item.getStyleHandle().borderWidth),
    // but we need some flag anyway to selectively enable border scaling (no point doing
    // this for eg canvasitems that are used as invisible hotspots), so we just use drawBorderSize
    // as a pixel width here
    if (item.drawBorderSize) {
        // floor of 1px prevents borders from disappearing entirely in IE
        item.getStyleHandle().borderWidth = Math.max(1, item.drawBorderSize * this.zoomLevel) + "px";
    }
    delete item.synchingToPane;
},

// Update items and item properties that are not automatically updated by the viewbox
// transformation, or that must be corrected because of the viewbox transformation.
// Currently:
//  - move/resize canvasItems
//  - move/scale text for VML drawpanes
//  - scale lines for VML drawpanes
// TODO/future:
//  - prevent scaling of hairlines (always 1px) in SVG
//  - prevent scaling of fixed-size labels in SVG
//  - enforce minimum arrowhead sizes
// NOTE: must also account for the viewbox when elements are drawn or updated, so currently in:
//      drawPane.addCanvasItem()
//      drawItem._getElementVML()
//      drawItem.setLineWidth()
//      drawLabel._getElementVML()
//      drawLabel.setFontSize()
// TODO recurse through DrawGroups - this only hits the top level
_updateItemsToViewBox : function () {
    // update canvasItems - see addCanvasItem()
    for (var i=0, ci; i<this.canvasItems.length; i++) {
        this._updateCanvasItemToViewBox(this.canvasItems[i]);
    }

    var prevZoomLevel;
    var zoomLevel = this._prevZoomLevel = this.zoomLevel;
    var zoomLevelChanged = prevZoomLevel != zoomLevel;

    // scalable text and linewidths for VML
    if (this.drawingType === "vml") {
        for (var i = 0; i < this.drawItems.length; ++i) {
            var di = this.drawItems[i];
            if (isc.isA.DrawLabel(di)) {
                // TODO hide these attributes behind DrawLabel setters
                // scale font size
                //  alternate approach - could just change the CSS class, eg:
                //  isc.Element.getStyleDeclaration("drawLabelText").fontSize = 24 * zoomLevel;
                if (zoomLevelChanged) di._getVMLTextHandle().fontSize = (di.fontSize * this.zoomLevel) + "px";
                if (!di.synchTextMove) {
                    // using higher-performance external html DIVs - but need to move them ourselves
                    var screenCoords = this.drawing2screen([di.left, di.top, 0, 0]); // width/height not used here - labels overflow
                    var vmlHandleStyle = di._getVMLHandle().style;
                    vmlHandleStyle.left = screenCoords[0] + isc.px;
                    vmlHandleStyle.top = screenCoords[1] + isc.px;
                }
            } else if (zoomLevelChanged) {
                // scale linewidths (TODO call this on DrawShapes only, when DrawShape has been factored out)
                di._setLineWidthVML(di.lineWidth * this.zoomLevel);
            }
        }

    // update the CSS3 transform of "htmlText" DrawLabels
    } else if (this.drawingType === "bitmap") {
        for (var i = 0; i < this.drawItems.length; ++i) {
            var di = this.drawItems[i];
            if (isc.isA.DrawLabel(di) && di._htmlText != null) {
                isc.Element._updateTransformStyle(di._htmlText, di._htmlText._getTransformFunctions());
            }
        }
    }
},

getScrollLeft : function () {
    return this.scrollLeft;
},

getScrollRight : function () {
    return Math.max(0, this.drawingWidth * this.zoomLevel - this._viewPortWidth) << 0;
},

getScrollTop : function () {
    return this.scrollTop;
},

getScrollBottom : function () {
    return Math.max(0, this.drawingHeight * this.zoomLevel - this._viewPortHeight) << 0;
},

scrollTo : function (left, top, reason) {
    if (left == null) left = this.scrollLeft;
    if (top == null) top = this.scrollTop;

    left = Math.max(0, Math.min(left, this.getScrollRight()));
    top = Math.max(0, Math.min(top, this.getScrollBottom()));

    if (this.scrollLeft != left || this.scrollTop != top) {
        this.scrollLeft = left;
        this.scrollTop = top;
        delete this._transform;

        this._viewBoxUpdated();
    }
},

// Global Pan
//  anticipated panning UIs:
//      - draggable viewbox outline in a thumbnail view -- drag&drop or realtime
//      - hand tool -- drag outlines or realtime
//      - arrow keys/buttons - press to pan by steps
//  so panRight and panDown are *deltas in screen (pixel) coordinates*
pan : function (panRight, panDown) {
    var translate = this.translate;
    if (translate == null) translate = this.translate = [0, 0];
    translate[0] -= panRight;
    translate[1] -= panDown;
    delete this._transform;

    this._viewBoxUpdated();
},

//> @method drawPane.setZoomLevel()
// Sets the zoom on this <code>DrawPane</code> to the specified magnification, maintaining the
// current viewport position.
//
// @param zoomLevel (float) Desired zoom level as a float where <code>1.0</code> is equivalent
// to 100% magnification. Must be greater than 0.
// @visibility drawing
//<

setZoomLevel : function (zoomLevel) {
    if (!(zoomLevel > 0)) { // this way catches NaN, null, undefined
        this.logWarn("The requested zoomLevel:" + zoomLevel + " is not greater than 0.");
        return;
    }

    this.zoomLevel = zoomLevel;
    this.scrollLeft = Math.max(0, Math.min(this.scrollLeft, this.getScrollRight()));
    this.scrollTop = Math.max(0, Math.min(this.scrollTop, this.getScrollBottom()));
    delete this._transform;

    this._viewBoxUpdated();
},

//> @method drawPane.zoom()
// Synonym of +link{DrawPane.setZoomLevel()}.
// @include DrawPane.setZoomLevel()
//<
zoom : function (zoomLevel) {
    this.setZoomLevel(zoomLevel);
},

//> @method drawPane.setRotation()
// Sets the +link{DrawPane.rotation,rotation} of the <code>DrawPane</code>.
//
// @param degrees (double) the new rotation in degrees. The positive direction corresponds to
// clockwise rotation.
// @visibility drawing
//<
setRotation : function (degrees) {
    this.rotation = degrees;
    delete this._transform;

    this._viewBoxUpdated();
},

//> @method drawPane.rotate()
// Synonym of +link{DrawPane.setRotation()}.
// @include DrawPane.setRotation()
//<
rotate : function (degrees) {
    this.setRotation(degrees);
},

//> @method drawPane.addGradient()
// Add a new gradient to the drawPane shared gradient list (+link{drawPane.gradients}). If the
// gradient does not have an ID a new one will be assigned.
//
// @param gradient (Gradient) gradient to add
// @return (identifier) the ID of the gradient (either provided or auto-assigned)
// @visibility drawing
//<
addGradient : function (gradient) {
    var id = gradient.id;
    if (!id) {
        if (!this._nextGradientID) this._nextGradientID = 0;
        id = this.getID() + "_gradient_" + this._nextGradientID++;
        gradient.id = id;
    }
    if (!gradient._constructor) gradient._constructor = isc.DrawItem._getGradientConstructor(gradient);

    if (this._gradientMap[gradient.id] != null) {
        isc.logWarn("Duplicate gradient with ID " + gradient.id + " - replacing previous gradient");
    }

    if (!this.gradients) {
        this.gradients = [];
        this._gradientMap = {};
    }

    this.gradients.add(gradient);
    this._gradientMap[id] = gradient;
    return id;
},

//> @method drawPane.getGradient()
// Returns gradient for gradientID.
//
// @param gradientID (identifier) ID of gradient to retrieve
// @return (Gradient) the gradient or null if not found
//@visibility drawing
//<
getGradient : function (gradientID) {
    return (this.gradients ? this._gradientMap[gradientID] : null);
},

//> @method drawPane.removeGradient()
// Removes gradient for gradientID.
//
// @param gradientID (identifier) ID of gradient to remove
// @visibility drawing
//<
removeGradient : function (gradientID) {
    if (this.gradients) {
        var gradient = this._gradientMap[gradientID];
        if (gradient) {
            delete this._gradientMap[gradientID];
            this.gradients.remove(gradient);
        }
    }
},

//> @method drawPane.createSimpleGradient()
// Creates a simple linear gradient which can be used by any DrawItem of this DrawPane.
// Any DrawItem's +link{DrawItem.fillGradient,fillGradient} can reference the gradient by the
// given ID.
//
// @param id (identifier) the ID of the simple linear gradient
// @param simple (SimpleGradient) the simple linear gradient
// @return (identifier) id
// @deprecated in favor of +link{drawPane.addGradient}
// @visibility drawing
//<
createSimpleGradient : function(id, simple) {
    simple.id = id;
    this.addGradient(simple);
    return id;
},

//> @method drawPane.createLinearGradient()
// Creates a linear gradient which can be used by any DrawItem of this DrawPane.
// Any DrawItem's +link{DrawItem.fillGradient,fillGradient} can reference the gradient by the
// given ID.
//
// @param id (identifier) the ID of the linear gradient
// @param linearGradient (LinearGradient) the linear gradient
// @return (identifier) id
// @deprecated in favor of +link{drawPane.addGradient}
// @visibility drawing
//<
createLinearGradient : function(id, linearGradient) {
    linearGradient.id = id;
    this.addGradient(linearGradient);
    return id;
},

//> @method drawPane.createRadialGradient()
// Creates a radial gradient which can be used by any DrawItem of this DrawPane.
// Any DrawItem's +link{DrawItem.fillGradient,fillGradient} can reference the gradient by the
// given ID.
//
// @param id (identifier) the ID of the radial gradient
// @param radialGradient (RadialGradient) the radial gradient
// @return (identifier) id
// @deprecated in favor of +link{drawPane.addGradient}
// @visibility drawing
//<
createRadialGradient : function(id, radialGradient) {
    radialGradient.id = id;
    this.addGradient(radialGradient);
    return id;
},

// shouldDeferDrawing() - check for the case where the drawPane is drawn but not yet ready to
// render out content, and set up a deferred draw operation here
shouldDeferDrawing : function (item) {
    // Assume this is only called when this.isDrawn() is true
    if (this._isBatchDrawing() ||
        (this.drawingType == "svg" && !this._svgDocument) ||
        (this.drawingType == "vml" && !this.getHandle()))
    {
        if (!this._delayedDrawItems) {
            this._delayedDrawItems = [item];
        } else {
            if (!this._delayedDrawItems.contains(item)) this._delayedDrawItems.add(item);
        }
        return true;
    }
    return false;
},

cancelDeferredDraw : function (item) {
    if (this._delayedDrawItems) {
        return this._delayedDrawItems.remove(item);
    }
    return false;
},

// TODO execute deferred draw operations here
// TODO remove these props from DrawItem - can get them via drawItem.drawPane
svgLoaded : function () {
    this._svgDocument = this.getHandle().firstChild.contentDocument; // svg helper doc in iframe
    this._svgBody = this._svgDocument.getElementById("isc_svg_body"); // outermost svg element
    this._svgBox = this._svgDocument.getElementById("isc_svg_box"); // outermost svg group
    this._svgDefs = this._svgDocument.getElementById("isc_svg_defs"); // defs element (container for arrowhead markers, gradients, and filters)

    this._updateViewPort();

    if (this._delayedDrawItems) {
        if (!this._isRedrawTEAScheduled()) this._endBatchDrawing(true);
    }
    this._isLoaded = true;
}


}) // end DrawPane.addProperties


isc.DrawPane.addClassProperties({
    defaultDrawingType: isc.Browser.defaultDrawingType,

    // DrawPane class provides default fullscreen DrawPane instances for each drawingType,
    // which are used by DrawItems that are not provided with a DrawPane
    _defaultDrawPanes: [],
    getDefaultDrawPane : function (type) {
        if (!type) type = this.defaultDrawingType;
        if (this._defaultDrawPanes[type]) return this._defaultDrawPanes[type];
        var ddp = this._defaultDrawPanes[type] = this.create({
            drawingType: type,
            // initialize container size to the display rect of the page
            // see (ISSUE: CANVAS element clipping) above
            // this size will be passed through to the CANVAS or SVG element
            width: isc.Page.getScrollWidth(),
            height: isc.Page.getScrollHeight(),
            autoDraw: true
        });
        ddp.sendToBack();
        return ddp;
    },

    _getMeasureCanvas : function () {
        var measureCanvas = this._measureCanvas;
        if (measureCanvas == null) {
            measureCanvas = this._measureCanvas = isc.Canvas.create({
                top: -1000,
                overflow: "visible",
                autoDraw: false,
                height: 1,
                width: 1,
                markForRedraw : isc.Class.NO_OP
            });
            measureCanvas.draw();
        }

        return measureCanvas;
    },

    // color helper functions
    addrgb: function(a, b) {
        var ca = Array(parseInt('0x'+a.substring(1,3),16),parseInt('0x'+a.substring(3,5),16),parseInt('0x'+a.substring(5,7),16));
        var cb = Array(parseInt('0x'+b.substring(1,3),16),parseInt('0x'+b.substring(3,5),16),parseInt('0x'+b.substring(5,7),16));
        var red = ca[0] + cb[0];
        red = Math.round(red > 0xff ? 0xff : red).toString(16);
        red = red.length === 1 ? "0" + red : red;
        var green = ca[1] + cb[1];
        green = Math.round(green > 0xff ? 0xff : green).toString(16);
        green = green.length === 1 ? "0" + green: green;
        var blue = ca[2] + cb[2];
        blue = Math.round(blue > 0xff ? 0xff : blue).toString(16);
        blue = blue.length === 1 ? "0" + blue: blue;
        return '#' + red + green + blue;
    },
    subtractrgb: function(a, b) {
        var ca = Array(parseInt('0x'+a.substring(1,3),16),parseInt('0x'+a.substring(3,5),16),parseInt('0x'+a.substring(5,7),16));
        var cb = Array(parseInt('0x'+b.substring(1,3),16),parseInt('0x'+b.substring(3,5),16),parseInt('0x'+b.substring(5,7),16));
        var red = ca[0] - cb[0];
        red = Math.round(red < 0x0 ? 0x0 : red).toString(16);
        red = red.length === 1 ? "0" + red : red;
        var green = ca[1] - cb[1];
        green = Math.round(green < 0x0 ? 0x0 : green).toString(16);
        green = green.length === 1 ? "0" + green: green;
        var blue = ca[2] - cb[2];
        blue = Math.round(blue < 0x0 ? 0x0 : blue).toString(16);
        blue = blue.length === 1 ? "0" + blue: blue;
        return '#' + red + green + blue;
    },
    mixrgb: function(a, b){
        return b.charAt(0) === '+' ? isc.DrawPane.addrgb(a,b.substring(1)) : b.charAt(0) === '-' ? isc.DrawPane.subtractrgb(a,b.substring(1)) : b;
    },
    // _mutergb() "mutes" colors by shifting them a given percentage toward white (or for
    // negative percentages, toward black).
    _mutergb : function (colorMutePercent, color) {


        // Convert from RGB to HSL, adjust the lightness according to colorMutePercent, then convert back to RGB.
        // See:  http://en.wikipedia.org/wiki/HSL_and_HSV

        var cr = parseInt('0x' + color.substring(1, 3), 16) / 255,
            cg = parseInt('0x' + color.substring(3, 5), 16) / 255,
            cb = parseInt('0x' + color.substring(5, 7), 16) / 255,
            min = Math.min(cr, cg, cb),
            max = Math.max(cr, cg, cb),
            h, s, l = (min + max) / 2;

        if (min == max) {
            h = s = 0;
        } else {
            var c = max - min;
            s = c / (2 * (l < 0.5 ? l : 1 - l));
            if (max == cr) {
                h = (cg - cb) / c;
                if (cg < cb) {
                    h += 6;
                }
            } else if (max == cg) {
                h = (cb - cr) / c + 2;
            } else {
                h = (cr - cg) / c + 4;
            }
            h /= 6;
        }



        if (colorMutePercent <= 0) {
            l *= (100 + colorMutePercent) / 100;
        } else {
            l += (colorMutePercent / 100) * (1 - l);
        }



        var red, green, blue;
        if (s == 0) {
            red = green = blue = Math.round(255 * l).toString(16);
        } else {
            var high = l + s * (l < 0.5 ? l : 1.0 - l),
                low = 2 * l - high,
                h0 = (3 * h - Math.floor(3 * h)) / 3,
                mid = high - 6 * (high - low) * Math.abs(h0 - 1/6),
                r, g, b;
            switch (Math.floor(h * 6)) {
            case 0:
            case 6:  r = high; g = mid;  b = low;  break;
            case 1:  r = mid;  g = high; b = low;  break;
            case 2:  r = low;  g = high; b = mid;  break;
            case 3:  r = low;  g = mid;  b = high; break;
            case 4:  r = mid;  g = low;  b = high; break;
            case 5:  r = high; g = low;  b = mid;  break;
            }

            red = Math.round(255.0 * r).toString(16);
            green = Math.round(255.0 * g).toString(16);
            blue = Math.round(255.0 * b).toString(16);
        }

        red = red.length === 1 ? "0" + red : red;
        green = green.length === 1 ? "0" + green : green;
        blue = blue.length === 1 ? "0" + blue : blue;

        return '#' + red + green + blue;
    },
    hex2rgb: function(hex,opacity) {
        var hexValue = hex.split('#')[1];
        var hexValueLength = hexValue.length/3;
        var redHex = hexValue.substring(0,hexValueLength);
        var greenHex = hexValue.substring(hexValueLength,hexValueLength*2);
        var blueHex = hexValue.substring(hexValueLength*2,hexValueLength*3);
        var red = parseInt(redHex.toUpperCase(),16);
        var green = parseInt(greenHex.toUpperCase(),16);
        var blue = parseInt(blueHex.toUpperCase(),16);
        var rgb = (typeof(opacity) !== 'undefined') ? 'rgba('+red+','+green+','+blue+','+opacity+')': 'rgb('+red+','+green+','+blue+')';
        return rgb;
    },
    rgb2hex: function(value){
        var hex = "", v, i;
        var regexp = /([0-9]+)[, ]+([0-9]+)[, ]+([0-9]+)/;
        var h = regexp.exec(value);
        for (i = 1; i < 4; i++) {
          v = parseInt(h[i],10).toString(16);
          if (v.length == 1) {
            hex += "0" + v;
          } else {
            hex += v;
          }
        }
        return ("#" + hex);
    },

    //> @classMethod drawPane.scaleAndCenter()
    // Computes the top-, left-, bottom-, and right-most coordinates in a list
    // of points, then translates and scales all points to fit the entire shape
    // into the given width and height.
    // <smartclient>
    // <p>
    // The example call below scales a set of points into a 100x100 thumbnail:
    //
    // <pre>
    //    var scaledPoints = DrawPane.scaleAndCenter(100, 100, 50, 50,
    //            [[500, 50], [525, 50], [550, 75], [575, 75],
    //             [600, 75], [600, 125], [575, 125], [550, 125],
    //             [525, 150], [500, 150]]);
    // </pre>
    // </smartclient>
    // @param width (int) width of target space
    // @param height (int) height of target space
    // @param xc (int) center point x
    // @param yc (int) center point y
    // @param points (Array of Point) list of points to scale and translate
    // @visibility drawing
    //<
    scaleAndCenter : function (width, height, xc, yc, points) {
        var n = points.length,
            minX = points[0][0],
            maxX = minX,
            minY = points[0][1],
            maxY = minY;

        for (var i = 1; i < n; ++i) {
            var x = points[i][0],
                y = points[i][1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        var x0 = (minX + maxX) / 2,
            y0 = (minY + maxY) / 2,
            scaleX = width / (maxX - minX),
            scaleY = height / (maxY - minY);

        for (var i = 0; i < n; ++i) {
            var point = points[i];
            point[0] = Math.round(xc + scaleX * (point[0] - x0));
            point[1] = Math.round(yc + scaleY * (point[1] - y0));
        }
        return points;
    },

    //> @classMethod drawPane.bezier()
    // Computes a cubic Be&#769;zier curve polynomial:
    // <code>
    // B(t) = (1 - t)<sup>3</sup>P<sub>1</sub> + 3(1 - t)<sup>2</sup>tCP<sub>1</sub> + 3(1 - t)t<sup>2</sup>CP<sub>2</sub> + t<sup>3</sup>P<sub>2</sub>
    // </code>
    // @param p1 (double) starting point coordinate
    // @param cp1 (double) first control point coordinate
    // @param cp2 (double) second control point coordinate
    // @param p2 (double) end point coordinate
    // @param t (double) the value of the parameter of the curve, between 0 and 1
    // @return (double) the value of the polynomial <code>B(t)</code> at <code>t</code>
    // @visibility drawing
    //<
    bezier : function (p1, cp1, cp2, p2, t) {

        var u = (1 - t),
            ab = u * p1 + t * cp1,
            bc = u * cp1 + t * cp2,
            cd = u * cp2 + t * p2,
            abbc = u * ab + t * bc,
            bccd = u * bc + t * cd;
        return (u * abbc + t * bccd);
    },

    //> @classMethod drawPane.bezierExtrema()
    // Computes the minimum and maximum value of the cubic Be&#769;zier curve polynomial
    // defined in +link{bezier()},
    // for <code>0 &le; t &le; 1</code>.
    // @param p1 (double) starting point coordinate
    // @param cp1 (double) first control point coordinate
    // @param cp2 (double) second control point coordinate
    // @param p2 (double) end point coordinate
    // @return (array of double) the minimum and maximum value of the cubic Be&#769;zier curve
    // polynomial
    // @visibility drawing
    //<
    bezierExtrema : function (p1, cp1, cp2, p2) {
        var epsilon = 1e-6,
            min = Math.min(p1, p2),
            max = Math.max(p1, p2);


        var a = (-p1 + 3 * (cp1 - cp2) + p2),
            b = 2 * (p1 - cp1 - cp1 + cp2),
            c = (-p1 + cp1),
            discriminant = (b * b - 4 * a * c),
            aIsZero = (Math.abs(a) < epsilon);

        if (aIsZero) {
            var bIsZero = (Math.abs(b) < epsilon);
            if (!bIsZero) {
                var root = -c / b;
                root = Math.max(0, Math.min(1, root));
                var value = isc.DrawPane.bezier(p1, cp1, cp2, p2, root);
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        } else if (discriminant >= 0) {
            var sqrtDiscriminant = Math.sqrt(discriminant),
                root1 = (-b + sqrtDiscriminant) / (2 * a),
                root2 = (-b - sqrtDiscriminant) / (2 * a);

            root1 = Math.max(0, Math.min(1, root1));
            root2 = Math.max(0, Math.min(1, root2));
            var value1 = isc.DrawPane.bezier(p1, cp1, cp2, p2, root1),
                value2 = isc.DrawPane.bezier(p1, cp1, cp2, p2, root2);
            min = Math.min(min, value1, value2);
            max = Math.max(max, value1, value2);
        }

        return [min, max];
    },

    //> @classMethod drawPane.getBezierBoundingBox()
    // Calculate the bounding box of the cubic Be&#769;zier curve with endpoints
    // <code>p1</code> and <code>p2</code> and control points <code>cp1</code> and
    // <code>cp2</code>.
    // @param p1 (Point) start point of the curve
    // @param cp1 (Point) first cubic Be&#769;zier control point
    // @param cp2 (Point) second cubic Be&#769;zier control point
    // @param p2 (Point) end point of the curve
    // @return (array of double) the x1, y1, x2, y2 coordinates.  The point
    // <code>(x1, y1)</code> is the top-left point of the bounding box and the point
    // <code>(x2, y2)</code> is the bottom-right point of the bounding box.
    // @visibility drawing
    //<
    getBezierBoundingBox : function (p1, cp1, cp2, p2) {
        var xExtrema = isc.DrawPane.bezierExtrema(
                p1[0], cp1[0], cp2[0], p2[0]),
            yExtrema = isc.DrawPane.bezierExtrema(
                p1[1], cp1[1], cp2[1], p2[1]);

        return [xExtrema[0], yExtrema[0], xExtrema[1], yExtrema[1]];
    },

    //> @classMethod drawPane.scaleAndCenterBezier()
    // Computes the top-, left-, bottom-, and right-most coordinates containing the
    // Be&#769;zier curve defined by <code>startPoint</code>, <code>controlPoint1</code>,
    // <code>controlPoint2</code>, and <code>endPoint</code>, then translates and scales these
    // four points to fit the entire curve into the given width and height.
    // @param width (int) width of target space
    // @param height (int) height of target space
    // @param xc (int) center point x
    // @param yc (int) center point y
    // @param startPoint (Point) start point of the curve
    // @param endPoint (Point) end point of the curve
    // @param controlPoint1 (Point) first cubic Be&#769;zier control point
    // @param controlPoint2 (Point) second cubic Be&#769;zier control point
    // @visibility drawing
    //<
    scaleAndCenterBezier : function (
        width, height, xc, yc, startPoint, endPoint, controlPoint1, controlPoint2)
    {
        var box = isc.DrawPane.getBezierBoundingBox(
                startPoint, controlPoint1, controlPoint2, endPoint),
            maxX = box[2],
            minX = box[0],
            maxY = box[3],
            minY = box[1],
            scaleX = width / (maxX - minX),
            scaleY = height / (maxY - minY),
            x0 = (minX + maxX) / 2,
            y0 = (minY + maxY) / 2;

        startPoint[0] = Math.round(xc + scaleX * (startPoint[0] - x0));
        startPoint[1] = Math.round(yc + scaleY * (startPoint[1] - y0));
        endPoint[0] = Math.round(xc + scaleX * (endPoint[0] - x0));
        endPoint[1] = Math.round(yc + scaleY * (endPoint[1] - y0));
        controlPoint1[0] = Math.round(xc + scaleX * (controlPoint1[0] - x0));
        controlPoint1[1] = Math.round(yc + scaleY * (controlPoint1[1] - y0));
        controlPoint2[0] = Math.round(xc + scaleX * (controlPoint2[0] - x0));
        controlPoint2[1] = Math.round(yc + scaleY * (controlPoint2[1] - y0));
    },

    //> @classMethod drawPane.getRegularPolygonPoints()
    // Calls +link{getPolygonPoints()} with angles spread evenly over the full 360 degrees.
    // @param n (int) the number of vertices the polygon
    // @param width (int) width of target space
    // @param height (int) height of target space
    // @param xc (int) center point x
    // @param yc (int) center point y
    // @param startAngle (double) the angle (in radians) with respect to the center point of
    // the first vertex of the polygon
    // @return (array of Point) list of the vertices of the regular polygon
    // @visibility drawing
    //<
    getRegularPolygonPoints : function (n, width, height, xc, yc, startAngle) {
        var theta = 2 * Math.PI / n,
            angles = new Array(n);
        for (var i = 0; i < n; ++i) {
            angles[i] = startAngle + i * theta;
        }
        return isc.DrawPane.getPolygonPoints(width, height, xc, yc, angles);
    },

    //> @classMethod drawPane.getPolygonPoints()
    // Computes an array of Points for a polygon that has an equal distance from its center to
    // any of its vertices and that fits in the given width and height.
    // @param width (int) width of target space
    // @param height (int) height of target space
    // @param xc (int) center point x
    // @param yc (int) center point y
    // @param angles (array of double) the complete list of angles (in radians) with respect
    // to the center point at which the polygon must have vertices
    // @return (array of Point) list of the vertices of the polygon
    // @visibility drawing
    //<
    getPolygonPoints : function (width, height, xc, yc, angles) {
        var n = angles.length,
            points = new Array(n);
        if (n == 0) {
            return points;
        } else if (n == 1) {
            points[0] = [xc, yc];
            return points;
        }

        var maxSin = -1, minSin = 1, maxCos = -1, minCos = 1;
        for (var i = 0; i < n; ++i) {
            var angle = angles[i],
                sin = Math.sin(angle),
                cos = Math.cos(angle);

            points[i] = [cos, sin];

            maxSin = Math.max(maxSin, sin);
            minSin = Math.min(minSin, sin);
            maxCos = Math.max(maxCos, cos);
            minCos = Math.min(minCos, cos);
        }

        var t = Math.min(
                width / (maxCos - minCos),
                height / (maxSin - minSin)),
            xCenter = xc - width / 2 + (width - t * (maxCos - minCos)) / 2 - t * minCos,
            yCenter = yc - height / 2 + (height - t * (maxSin - minSin)) / 2 + t * maxSin;

        for (var i = 0; i < n; ++i) {
            var point = points[i];
            point[0] = Math.round(xCenter + t * point[0]);
            point[1] = Math.round(yCenter - t * point[1]);
        }

        return points;
    },

    _interpolateRGB : function (startColor, endColor, lambda) {
        // Calculate the red, green, and blue components of start and end colors in sRGB.
        var red0 = parseInt("0x" + startColor.substring(1, 3), 16) / 255,
            green0 = parseInt("0x" + startColor.substring(3, 5), 16) / 255,
            blue0 = parseInt("0x" + startColor.substring(5, 7), 16) / 255,
            red1 = parseInt("0x" + endColor.substring(1, 3), 16) / 255,
            green1 = parseInt("0x" + endColor.substring(3, 5), 16) / 255,
            blue1 = parseInt("0x" + endColor.substring(5, 7), 16) / 255;

        // Interpolate.
        var red = (1 - lambda) * red0 + lambda * red1,
            green = (1 - lambda) * green0 + lambda * green1,
            blue = (1 - lambda) * blue0 + lambda * blue1;

        // Return the hexadecimal representation.
        var redHex = Math.floor(Math.max(0, Math.min(255, 255 * red))).toString(16),
            greenHex = Math.floor(Math.max(0, Math.min(255, 255 * green))).toString(16),
            blueHex = Math.floor(Math.max(0, Math.min(255, 255 * blue))).toString(16);
        return (
            "#" +
            (redHex.length == 1 ? "0" + redHex : redHex) +
            (greenHex.length == 1 ? "0" + greenHex : greenHex) +
            (blueHex.length == 1 ? "0" + blueHex : blueHex));
    },

    _colorLightness : function (color) {

        var mask = 0xff,
            colorValue = parseInt(color.substr(1), 16),
            cr = ((colorValue >>> 16) & mask) / mask,
            cg = ((colorValue >>> 8) & mask) / mask,
            cb = (colorValue & mask) / mask,
            min = Math.min(cr, cg, cb),
            max = Math.max(cr, cg, cb);
        return (min + max) / 2;
    }
})



//------------------------------------------------------------------------------------------
//> @class DrawItem
//
// Base class for graphical elements drawn in a DrawPane.  All properties and methods
// documented here are available on all DrawItems unless otherwise specified.
// <P>
// Note that DrawItems as such should never be created, only concrete subclasses such as
// +link{DrawGroup} and +link{DrawLine}.
// <P>
// See +link{DrawPane} for the different approaches to create DrawItems.
//
// @treeLocation Client Reference/Drawing
// @visibility drawing
//<
//------------------------------------------------------------------------------------------

// DrawItem implements the line (aka stroke) and fill attributes that are shared
// by all drawing primitives.



isc.defineClass("DrawItem");

isc.DrawItem.addClassProperties({
    //> @classMethod drawItem.computeAngle()
    // Computes the angle in degrees from the positive X axis to the difference vector
    // <nobr><b>v</b><sub>2</sub> - <b>v</b><sub>1</sub></nobr> between the two given vectors.
    // @param px1 (double) X coordinate of <b>v</b><sub>1</sub>
    // @param py1 (double) Y coordinate of <b>v</b><sub>1</sub>
    // @param px2 (double) X coordinate of <b>v</b><sub>2</sub>
    // @param py2 (double) Y coordinate of <b>v</b><sub>2</sub>
    // @return (double) the angle in degrees, in the range [0, 360).
    // @visibility drawing
    //<
    _radPerDeg: isc.Math._radPerDeg,
    computeAngle : function (px1, py1, px2, py2) {
        // http://mathworld.wolfram.com/VectorDifference.html
        // http://www.euclideanspace.com/maths/algebra/vectors/angleBetween/issues/index.htm
        var a = Math.atan2(py2 - py1, px2 - px1);
        if (a < 0) a += 2 * Math.PI;
        return a / this._radPerDeg;
    },

    _isSimpleGradient : function (def) {
        return (def.direction != null);
    },
    _isLinearGradient : function (def) {
        return (def.x1 != null);
    },
    _isRadialGradient : function (def) {
        return (!isc.DrawItem._isSimpleGradient(def) && !isc.DrawItem._isLinearGradient(def));
    },
    _getGradientConstructor : function (def) {
        return (isc.DrawItem._isSimpleGradient(def) ? "SimpleGradient" :
            (isc.DrawItem._isLinearGradient(def) ? "LinearGradient" :
            "RadialGradient"));
    }
});

isc.DrawItem.addProperties({
    _radPerDeg: isc.Math._radPerDeg,

    //> @attr drawItem.cursor (Cursor : null : IRWA)
    // If set, specifies the cursor to display when the mouse pointer is over this DrawItem.
    // @visibility drawing
    //<
    //cursor: null,

    //> @attr drawItem.dragRepositionCursor (Cursor : "move" : IRWA)
    //<
    dragRepositionCursor: "move",

    //> @attr drawItem.canHover (boolean : null : IRW)
    // Will this DrawItem fire hover events when the user hovers over it?
    // @group hovers
    // @visibility drawing
    // @see showHover
    //<
    //canHover: null,

    //> @attr drawItem.showHover (boolean : true : IRW)
    // If +link{canHover,canHover} is true, should we show the global hover canvas by default
    // when the user hovers over this DrawItem?
    // @group hovers
    // @visibility drawing
    // @see getHoverHTML()
    //<
    showHover: true,

    //> @attr drawItem.prompt (HTMLString : null : IRW)
    // Default +link{getHoverHTML(),hover HTML} that is displayed in the global hover canvas if
    // the user hovers over this DrawItem and +link{showHover,showHover} is true.
    // @group hovers
    // @visibility drawing
    //<
    //prompt: null,

    // Pane / Group membership
    // ---------------------------------------------------------------------------------------

    //> @attr drawItem.drawPane   (DrawPane : null : IR)
    // +link{DrawPane} this drawItem should draw in.
    // <P>
    // If this item has a +link{drawGroup}, the drawGroup's drawPane is automatically used.
    // @visibility drawing
    //<

    //> @attr drawItem.drawGroup  (DrawGroup : null : IR)
    // +link{DrawGroup} this drawItem is a member of.
    // @visibility drawing
    //<

    // Line Styling
    // ---------------------------------------------------------------------------------------

    //> @attr drawItem.lineWidth  (int : 3 : IRW)
    // Pixel width for lines.
    // @group line
    // @visibility drawing
    //<
    // XXX setLineWidth(0) will not cause a VML line to disappear, but will cause an SVG line
    // to disappear
    lineWidth: 3,

    //> @attr drawItem.lineColor (CSSColor : "#808080" : IRW)
    // Line color
    // @group line
    // @visibility drawing
    //<
    lineColor: "#808080",

    //> @attr drawItem.lineOpacity (float : 1.0 : IRW)
    // Opacity for lines, as a number between 0 (transparent) and 1 (opaque).
    // @group line
    // @visibility drawing
    //<
    lineOpacity: 1.0,

    //> @attr drawItem.linePattern (LinePattern : "solid" : IRW)
    // Pattern for lines, eg "solid" or "dash"
    // @group line
    // @visibility drawing
    //<
    linePattern: "solid",

    //> @type LinePattern
    // Supported styles of drawing lines.
    // @value "solid"     Solid line
    // @value "dot"       Dotted line
    // @value "dash"      Dashed line
    // @value "shortdot"  Dotted line, with more tightly spaced dots
    // @value "shortdash" Dashed line, with shorter, more tightly spaced dashes
    // @value "longdash"  Dashed line, with longer, more widely spaced dashes
    // @group line
    // @visibility drawing
    //<
    // see setLinePattern() for notes on expanding this set

    //> @attr drawItem.lineCap     (LineCap : "round" : IRW)
    // Style of drawing the endpoints of a line.
    // <P>
    // Note that for dashed and dotted lines, the lineCap style affects each dash or dot.
    //
    // @group line
    // @visibility drawing
    //<
    lineCap: "round",

    //> @type LineCap
    // Supported styles of drawing the endpoints of a line
    //
    // @value "round"    Semicircular rounding
    // @value "square"   Squared-off endpoint
    // @value "butt"     Square endpoint, stops exactly at the line's end coordinates instead
    //                   of extending 1/2 lineWidth further as "round" and "square" do
    //
    // @group line
    // @visibility drawing
    //<

    // Fill Styling
    // ---------------------------------------------------------------------------------------

    //> @attr drawItem.fillColor     (CSSColor : null : IRW)
    // Fill color to use for shapes.  The default of 'null' is transparent.
    // @group fill
    // @visibility drawing
    //<
    //fillColor: null, // transparent

    //> @attr drawItem.fillGradient     (Gradient | string: null : IRW)
    // Fill gradient to use for shapes.  If a string it uses the gradient identifier parameter provided in
    // +link{drawPane.addGradient}. Otherwise it expects one of +link{SimpleGradient,SimpleGradient},
    // +link{LinearGradient,LinearGradient} or +link{RadialGradient,RadialGradient}.
    // @see Gradient
    // @group fill
    // @visibility drawing
    //<
    fillGradient: null,

    //> @attr drawItem.fillOpacity   (float : 1.0 : IRW)
    // Opacity of the fillColor, as a number between 0 (transparent) and 1 (opaque).
    // @group fill
    // @visibility drawing
    //<
    fillOpacity: 1.0,

    //> @attr drawItem.shadow  (Shadow: null : IRW)
    // Shadow used for all DrawItem subtypes.
    // @visibility drawing
    //<
    shadow: null,

    //> @attr drawItem.rotation (float : 0.0 : IR)
    // Rotation in degrees about the +link{getCenter(),center point}.
    // The positive direction is clockwise.
    // @visibility drawing
    //<
    rotation: 0,

    //> @attr drawItem.xShearAngle (float : 0.0 : IRA)
    // An angle in degrees that defines a slope of a shearing transformation applied to this
    // DrawItem.  Each point in the shape is moved along the x-axis a distance that is
    // proportional to the initial y-coordinate of the point.  The exact proportion is given
    // by the tangent of the xShearAngle.
    // <p>
    // The positive direction is counter-clockwise.  The angle must also be greater than
    // -90 degrees and less than 90 degrees.
    // @visibility drawing
    //<
    xShearAngle: 0,

    //> @attr drawItem.scale (Array[] of int : null : IRA)
    // Array holds 2 values representing scaling along x and y dimensions.
    // @visibility drawing
    //<
    scale: null,

    //> @attr drawItem.translate (Array[] of int : null : IRA)
    // Array holds two values representing translation along the x and y dimensions.
    // @visibility drawing
    //<
    translate: null,

    //> @attr drawItem.svgFilter (String : null : IRA)
    // ID of an SVG <code>&lt;filter&gt;</code> definition to use.
    //<
    svgFilter: null,

    // Arrowheads
    // ---------------------------------------------------------------------------------------

    //> @attr drawItem.startArrow    (ArrowStyle : null : IRW)
    // Style of arrowhead to draw at the beginning of the line or path.
    //
    // @visibility drawing
    //<

    //> @attr drawItem.endArrow (ArrowStyle : null : IRW)
    // Style of arrowhead to draw at the end of the line or path.
    //
    // @visibility drawing
    //<

    //> @type ArrowStyle
    // Supported styles for arrowheads
    // @value "block"     Solid triangle
    // @value "open" arrow rendered as an open triangle. Only applies to
    //  +link{DrawLinePath,DrawLinePaths} - for other items this will be treated as
    //  <code>"block"</code>
    // @value null  Don't render an arrowhead at all
    // @visibility drawing
    //<

    // Future styles, lifted from VML spec:
    // @value "classic"   Classic triangular "barbed arrow" shape
    // @value "open"      Open triangle
    // @value "oval"      Oval line endpoint (not an arrow)
    // @value "diamond"   Diamond line endpoint (not an arrow)
    // Note that VML also defines "chevron" and "doublechevron" but these do nothing in IE
    // Note: We currently do support "open" style arrow heads via segmented lines in drawLinePaths
    // only

    // Control Knobs
    // -----------------------------------------------------------------------------------------

    //> @attr drawItem.knobs (Array of KnobType : null : IR)
    // Array of control knobs to display for this item. Each +link{knobType} specified in this array
    // will turn on UI element(s) allowing the user to manipulate this drawItem.  To update the
    // set of knobs at runtime use +link{drawItem.showKnobs()} and +link{drawItem.hideKnobs()}.
    // <p>
    // <b>NOTE:</b> Unless otherwise documented, DrawItem types only support
    // <smartclient>"resize" and "move"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE} and {@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
    // knobs.
    //
    // @example editDrawPane
    // @example drawKnobs
    // @visibility drawing
    //<

    //> @type KnobType
    // Entries for the +link{drawItem.knobs} array. Each specified knobType will enable some UI
    // allowing the user to manipulate the DrawItem directly.
    // <p>
    // <b>NOTE:</b> Not all knob types are supported by each DrawItem type. Refer to the DrawItem
    // type's +link{DrawItem.knobs,knobs} attribute documentation for a list of the supported knob types.
    //
    // @value "resize"
    //  Display up to 8 control knobs at the corners specified by +link{DrawItem.resizeKnobPoints},
    //  allowing the user to drag-resize the item.
    //  See also +link{drawItem.cornerResizeKnob} and +link{drawItem.sideResizeKnob}.
    //
    // @value "move"
    //  Display a control knob for moving the item around. See also +link{drawItem.moveKnobPoint}
    //  and +link{drawItem.moveKnobOffset}
    //
    // @value "startPoint"
    //  Control knob  to manipulate +link{drawLine.startPoint}.
    //
    // @value "endPoint"
    //  Control knob to manipulate +link{drawLine.endPoint}.
    //
    // @value "controlPoint1"
    //  Display a draggable control knob along with a DrawLine indicating the angle between controlPoint1
    //  and the startPoint. Dragging the knob will adjust controlPoint1.
    //
    // @value "controlPoint2"
    //  Display a draggable control knob along with a DrawLine indicating the angle between controlPoint2
    //  and the endPoint. Dragging the knob will adjust controlPoint2.
    // @visibility drawing
    //<

    //> @attr drawItem.keepInParentRect (Boolean | Array of Float : null : IRWA)
    // Constrains drag-resizing and drag-repositioning of this draw item to either the current
    // visible area of the +link{drawPane,draw pane} or an arbitrary bounding box (if set to
    // an array of the form <code>[left, top, left + width, top + height]</code>).  When using
    // a bounding box-type argument the left/top values can be negative, or the width/height
    // values can be greater than the dimensions of the viewable area, to allow positioning
    // or resizing the draw item beyond the confines of the draw pane.
    // <P>
    // Note:  keepInParentRect affects only user drag interactions, not programmatic moves or
    // resizes.
    //
    // @visibility drawing
    //<

    //drawingType: null, // vml, bitmap, svg - only respected for implicit DrawPane


    autoOffset:true,
    canDrag: false,

    //> @attr drawItem.hitTolerance (double : 0 : IRA)
    // A tolerance applied in checks for whether a mouse event is within this <code>DrawItem</code>.
    // Increasing the tolerance makes this <code>DrawItem</code> easier to click, drag, etc.
    // <p>
    // The tolerance is applied in the item's local coordinate system. If there is no scaling
    // in effect, either globally on the <code>DrawPane</code> or locally via a nontrivial
    // +link{DrawItem.scale,scale}, then this tolerance can be thought of as a distance in pixels.
    // <p>
    // This setting is only supported in Firefox 19+, Safari 6.1+, and Chrome 27+.
    //<

    hitTolerance: 0,


//> @method drawItem.setPropertyValue()
// Sets a property on this DrawItem, calling the appropriate setter method if one is found and
// is +link{class.isMethodSupported(),supported}.
// @param propertyName (String) name of the property to set
// @param newValue (any) new value for the property
// @see method:class.setProperty()
// @visibility external
//<

setPropertyValue : function (propertyName, newValue) {
    var setter = this._getSetter(propertyName),
        props;
    if (isc.isA.StringMethod(newValue)) {
        newValue = newValue.getValue();
    }
    if (setter != null) {
        // Check isMethodSupported() to avoid warnings for attempts to set unsupported
        // properties.
        if (!this.getClass().isMethodSupported(setter)) {
            return;
        }
        this[setter](newValue);
    } else {
        props = {};
        props[propertyName] = newValue;
        this.addProperties(props);
    }

    // Fire the notification function.
    if (this.propertyChanged) {
        this.propertyChanged(propertyName, newValue);
    }

    // Fire any "doneSettingProperties()" - allows the instance to respond to multiple
    // related properties being set without having to respond to each one.
    if (this.doneSettingProperties) {
        if (setter != null) {
            props = {};
            props[propertyName] = newValue;
        }
        this.doneSettingProperties(props);
    }
},

//> @method drawItem.setCursor()
//
// @param newCursor (Cursor) new cursor.
// @visibility drawing
//<
setCursor : function (newCursor) {
    this.cursor = newCursor;
},

//> @method drawItem.setDragRepositionCursor()
// Setter for +link{DrawItem.dragRepositionCursor,dragRepositionCursor}.
//
// @param dragRepositionCursor (Cursor) new value for <code>this.dragRepositionCursor</code>.
//<
setDragRepositionCursor : function (dragRepositionCursor) {
    this.dragRepositionCursor = dragRepositionCursor;
},

getCurrentCursor : function () {
    if (this.canDrag) return this.dragRepositionCursor;
    return this.cursor;
},

_updateQuadTreeItem : function () {
    var item = this.item;
    if (item != null) {
        var bboxPrime = this._getTransformedBoundingBox(true, true, true, this._tempBoundingBox);
        item.x = bboxPrime[0];
        item.y = bboxPrime[1];
        item.width = (bboxPrime[2] - bboxPrime[0]);
        item.height = (bboxPrime[3] - bboxPrime[1]);
        this.drawPane.quadTree.update(item);
    }
},

//> @method drawItem.getCenter()
// Returns the center point of the +link{DrawItem.getBoundingBox(),bounding box}.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    return [Math.round((bbox[0] + bbox[2]) / 2), Math.round((bbox[1] + bbox[3]) / 2)];
},

//> @method drawItem.getBoundingBox()
// Calculates the bounding box of the shape in the local coordinate system.
// @return (array) the x1, y1, x2, y2 coordinates. When the width and height are both positive,
// point (x1, y1) is the top-left point of the bounding box and point (x2, y2) is the bottom-right
// point of the bounding box.
// @visibility drawing
//<

_boundingBox: [0, 0, 0, 0],
getBoundingBox : function (includeStroke, outputBox) {

    var box = (outputBox || new Array(4));
    for (var i = 4; i--; ) {
        box[i] = this._boundingBox[i];
    }
    return box;
},


_tempBoundingBox: new Array(4),

_adjustBoundingBoxForStroke : function (bbox) {
    if (this._hasStroke()) {
        var halfLineWidth = this.lineWidth / 2;

        if (bbox[0] <= bbox[2]) {
            bbox[0] -= halfLineWidth;
            bbox[2] += halfLineWidth;
        } else {
            bbox[2] -= halfLineWidth;
            bbox[0] += halfLineWidth;
        }

        if (bbox[1] <= bbox[3]) {
            bbox[1] -= halfLineWidth;
            bbox[3] += halfLineWidth;
        } else {
            bbox[3] -= halfLineWidth;
            bbox[1] += halfLineWidth;
        }
    }
    return bbox;
},

// Calculate a bounding box of the DrawItem in the global coordinate system. This might not be
// a tight bounding box.
//
// The default implementation takes DrawItem's bounding box (in the local coordinate system),
// transforms it by the local and global transforms, and then returns the bounding box of the
// transformed box.  This is not the same as the bounding box of the shape in the global
// coordinate system, but it is inclusive.
// @return (Array of double) the x1', y1', x2', y2' coordinates
_getTransformedBoundingBox : function (
    includeStroke, excludeGlobalTransform, includeHitTolerance, outputBox)
{


    // http://stackoverflow.com/questions/622140/calculate-bounding-box-coordinates-from-a-rotated-rectangle-picture-inside

    var t;
    if (excludeGlobalTransform || this.drawPane == null) {
        t = this._getLocalTransform();
    } else {
        t = this.drawPane._getGlobalTransform().duplicate().rightMultiply(this._getLocalTransform());
    }

    var bbox = this.getBoundingBox(includeStroke, outputBox);
    // Since the hit tolerance is interpreted in the item's local coordinate system, the hit tolerance
    // is applied to the bounding box before being transformed.
    if (includeHitTolerance) {
        var hitTolerance = this.hitTolerance;

        if (bbox[0] <= bbox[2]) {
            bbox[0] -= hitTolerance;
            bbox[2] += hitTolerance;
        } else {
            bbox[2] -= hitTolerance;
            bbox[0] += hitTolerance;
        }

        if (bbox[1] <= bbox[3]) {
            bbox[1] -= hitTolerance;
            bbox[3] += hitTolerance;
        } else {
            bbox[3] -= hitTolerance;
            bbox[1] += hitTolerance;
        }
    }

    var v1 = t.transform(bbox[0], bbox[1]),
        v2 = t.transform(bbox[2], bbox[1]),
        v3 = t.transform(bbox[2], bbox[3]),
        v4 = t.transform(bbox[0], bbox[3]);

    bbox[0] = Math.min(v1.v0, v2.v0, v3.v0, v4.v0);
    bbox[1] = Math.min(v1.v1, v2.v1, v3.v1, v4.v1);
    bbox[2] = Math.max(v1.v0, v2.v0, v3.v0, v4.v0);
    bbox[3] = Math.max(v1.v1, v2.v1, v3.v1, v4.v1);
    return bbox;
},

// isInBounds / isPointInPath used for event handling.



//> @method drawItem.isInBounds(x,y)
// Returns true if the given point in the drawing coordinate system, when converted to
// coordinates in this DrawItem's local coordinate system, is within the
// +link{getBoundingBox(),bounding box} of this DrawItem's shape.
// <p>
// This method can be used to quickly check whether the given point is definitely <em>not</em> within
// the DrawItem shape. To check whether the point is within the DrawItem shape, use the slower
// but exact +link{isPointInPath()} method.
// @param x (int) X coordinate of the point in the drawing coordinate system.
// @param y (int) Y coordinate of the point in the drawing coordinate system.
// @return (boolean)
// @visibility drawing
//<
isInBounds : function (x, y) {
    var normalized = this._normalize(x, y),
        b = this.getBoundingBox(true, this._tempBoundingBox),
        hitTolerance = this.hitTolerance;


    return (
        ((b[0] - hitTolerance <= normalized.v0 && normalized.v0 <= b[2] + hitTolerance) ||
         (b[2] - hitTolerance <= normalized.v0 && normalized.v0 <= b[0] + hitTolerance)) &&
        ((b[1] - hitTolerance <= normalized.v1 && normalized.v1 <= b[3] + hitTolerance) ||
         (b[3] - hitTolerance <= normalized.v1 && normalized.v1 <= b[1] + hitTolerance)));
},

// @return (AffineTransform)
_getLocalTransform : function () {
    var t = this._transform;
    if (t != null) return t;

    t = isc.AffineTransform.create();
    if (this.translate) {
        t.translate(this.translate[0], this.translate[1]);
    }
    if (this.scale && this.scale.length === 2) {
        t.scale(this.scale[0], this.scale[1]);
    }
    if (this.xShearAngle && -90 < this.xShearAngle && this.xShearAngle < 90) {
        t.xShear(this.xShearAngle);
    }
    if (this.rotation) {
        if (isc.isA.DrawLabel(this)) {
            t.rotate(this.rotation, this.left, this.top + this._calculateAlignMiddleCorrection());
        } else {
            var center = this.getCenter && this.getCenter();
            if (center && center.length === 2) {
                t.rotate(this.rotation, center[0], center[1]);
            }
        }
    }
    return (this._transform = t);
},

// Convert coordinates in the drawing coordinate system to coordinates in this DrawItem's local
// coordinate system.
_normalize : function (x, y) {
    var inverseTransform = this._inverseTransform,
        transform = this._getLocalTransform();
    if (inverseTransform == null || transform != this._inverseInverseTransform) {
        inverseTransform = this._inverseTransform = transform.getInverse();
        this._inverseInverseTransform = transform;
    }
    return inverseTransform.transform(x, y);
},

//> @method drawItem.isPointInPath()
// Returns true if the given point in the drawing coordinate system is within this DrawItem's shape,
// taking into account local transforms.
// @param x (int) X coordinate of the test point.
// @param y (int) Y coordinate of the test point.
// @return (boolean)
// @visibility drawing
//<
isPointInPath : function (x, y, pageX, pageY) {
    var hitTolerance = this.hitTolerance,
        lineWidth = (
            (this.lineWidth == null ? 1 : Math.max(1, this.lineWidth)) +
            2 * hitTolerance);

    // Temporarily add half of the lineWidth to the hitTolerance when determining whether the
    // point in in bounds of the DrawItem.
    this.hitTolerance = lineWidth / 2;
    var isInBounds = this.isInBounds(x, y);
    this.hitTolerance = hitTolerance;
    if (!isInBounds) {
        return false;
    }

    if (this.drawingBitmap || this.drawPane.drawingType === "bitmap") {
        var context = this.drawPane.getBitmapContext(),
            isDrawCurve = isc.isA.DrawCurve(this);
        context.save();
        try {
            context.beginPath();
            if (isDrawCurve) {
                // The second argument is set to false to avoid filling or stroking the start
                // and end arrows.
                this.drawBitmapPath(context, false);
            } else {
                this.drawBitmapPath(context);
            }
            var normalized = this._normalize(x, y);
            if (context.isPointInPath(normalized.v0, normalized.v1)) return true;
            if (isDrawCurve && this._isPointInPathOfStartOrEndArrow(
                    context, lineWidth, normalized.v0, normalized.v1))
            {
                return true;
            } else if (isc.Browser._supportsCanvasIsPointInStroke) {
                context.lineWidth = lineWidth;
                context.lineCap = this.lineCap;
                context.lineJoin = "round";
                context.strokeStyle = "#ff00ff";

                return context.isPointInStroke(normalized.v0, normalized.v1);
            } else if (isDrawCurve) {
                return this._isPointInStroke(context, normalized.v0, normalized.v1);
            } else {
                return false;
            }
        } finally {
            context.restore();
        }
    } else if (this.drawingVML) {
        var vmlHandle = this._getVMLHandle();
        return vmlHandle.ownerDocument.elementFromPoint(pageX, pageY) === vmlHandle;
    }
    return true;
},

_isPointInPathOfStartOrEndArrow : function (context, lineWidth, x, y) {
    if (this.startArrow == "open" || this.startArrow == "block") {
        context.save();
        this._drawBitmapStartArrow(context, lineWidth, false);
        var success = (
                context.isPointInPath(x, y) ||
                (isc.Browser._supportsCanvasIsPointInStroke && context.isPointInStroke(x, y)));
        context.restore();
        if (success) {
            return true;
        }
    }
    if (this.endArrow == "open" || this.endArrow == "block") {
        context.save();
        this._drawBitmapEndArrow(context, lineWidth, false);
        var success = (
                context.isPointInPath(x, y) ||
                (isc.Browser._supportsCanvasIsPointInStroke && context.isPointInStroke(x, y)));
        context.restore();
        if (success) {
            return true;
        }
    }
    return false;
},

//> @method drawItem.computeAngle()
// Computes the angle in degrees from the positive X axis to the difference vector
// <nobr><b>v</b><sub>2</sub> - <b>v</b><sub>1</sub></nobr> between the two given vectors.
// @param px1 (double) X coordinate of <b>v</b><sub>1</sub>
// @param py1 (double) Y coordinate of <b>v</b><sub>1</sub>
// @param px2 (double) X coordinate of <b>v</b><sub>2</sub>
// @param py2 (double) Y coordinate of <b>v</b><sub>2</sub>
// @return (double) the angle in degrees, in the range [0, 360).
// @visibility drawing
//<
computeAngle : isc.DrawItem.computeAngle,

// DrawItem events
getHoverTarget : function (event, eventInfo) {
    return (this.drawPane ? this.drawPane.getHoverTarget(event, eventInfo) : null);
},

// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas
_allowNativeTextSelection : function (event) {
    return false;
},
_updateCursor : function () {
    if (this.drawPane) this.drawPane._updateCursor(this);
},
// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas
focus : function (reason) {
},
// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas
visibleAtPoint : function (x,y) {
    return true;
},
// Called by EventHandler.doHandleMouseDown() and required to allow DrawItem event
// functionality since DrawItem does not extend Canvas.
_getUseNativeDrag : function () {
    return false;
},

// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas

getDragAppearance : function (dragOperation) {
    return "none";
},
// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas
bringToFront: function () {
},
// Called by EventHandler and required to allow DrawItem event functionality
// since DrawItem does not extend Canvas
moveToEvent: function (x,y) {
    this.moveTo(x,y);
},

//> @attr drawItem.dragStartDistance        (number : 5 : IRWA)
// @include canvas.dragStartDistance
//<
dragStartDistance: 1,

getRect : function () {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    return [bbox[0],bbox[1],bbox[2]-bbox[0],bbox[3]-bbox[1]];
},

getPageOffsets : function () {
    var bboxPrime = this._getTransformedBoundingBox(true, false, false, this._tempBoundingBox);

    var offsets = {
        left: bboxPrime[0] << 0,
        top: bboxPrime[1] << 0
    };

    if (this.drawPane != null) {
        var dpOffsets = this.drawPane.getPageOffsets(),
            dpMargins = this.drawPane._calculateMargins();
        offsets.left += dpOffsets.left + dpMargins.left;
        offsets.top += dpOffsets.top + dpMargins.top;
    }

    return offsets;
},

//> @method drawItem.getPageLeft() (A)
// @include canvas.getPageLeft()
//<
getPageLeft : function () {
    return this.getPageOffsets().left;
},

//> @method drawItem.getPageTop() (A)
// @include canvas.getPageTop()
//<
getPageTop : function () {
    return this.getPageOffsets().top;
},

getVisibleDimensions : function () {
    var bboxPrime = this._getTransformedBoundingBox(true, false, false, this._tempBoundingBox);
    return {
        width: Math.ceil(bboxPrime[2] - bboxPrime[0]),
        height: Math.ceil(bboxPrime[3] - bboxPrime[1])
    };
},

getVisibleWidth : function () {
    return this.getVisibleDimensions().width;
},

getVisibleHeight: function () {
    return this.getVisibleDimensions().height;
},

//> @attr drawItem.canDrag (Boolean : false : IRWA)
// Is this DrawItem draggable? If true, then the DrawItem can be drag-repositioned by the user.
// @visibility drawing
//<

//> @method drawItem.setCanDrag()
// Setter for +link{DrawItem.canDrag,canDrag}.
//
// @param canDrag (Boolean) new value for <code>this.canDrag</code>.
// @visibility drawing
//<
setCanDrag : function (canDrag) {
    this.canDrag = canDrag;
},

//> @method drawItem.dragStart()
// Notification fired when the user starts to drag this DrawItem. Will only fire if +link{canDrag,canDrag}
// is true.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.dragStart()
// @visibility drawing
//<
dragStart : function (event, info) {
    if (this.logIsInfoEnabled("drawEvents")) {
        this.logInfo("DragStart on item:" + this.getID(), "drawEvents");
    }
    var bounds = this.getBoundingBox(false, this._tempBoundingBox),
        offsetX = bounds[0],
        offsetY = bounds[1],
        normalized = this.drawPane.normalize(event.x, event.y),
        edgeSize = (this.drawPane.showEdges && this.drawPane.edgeSize) || 0;
    this.lastDragX = normalized.v0 - this.drawPane.getPageLeft() - edgeSize;
    this.lastDragY = normalized.v1 - this.drawPane.getPageTop() - edgeSize;

    this.dragOffsetX = this.lastDragX - offsetX;
    this.dragOffsetY = this.lastDragY - offsetY;
    // For SGWT we want a separate event which can be easily customzied without the
    // need for a call to super.
    if (this.onDragStart(this.lastDragX, this.lastDragY) == false) {
        return false;
    }
    return true;
},

//> @method drawItem.onDragStart()
// If +link{DrawItem.canDrag} is true, this notification method will be fired when the user
// starts to drag the draw item.
// @param x (int) x-coordinate within the drawPane
// @param y (int) y-coordinate within the drawPane
// @return (boolean) return false to cancel the default behavior of allowing the shape to be drag-moved
// @visibility sgwt
//<
onDragStart : function (x, y) {
},

//> @method drawItem.dragMove()
// Notification fired for every mouseMove event triggered while the user is dragging this
// DrawItem.  Will only fire if +link{canDrag,canDrag} is true.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.dragMove()
// @visibility drawing
//<
dragMove : function (event, info, bubbledFromDrawItem) {
    var normalized = this.drawPane.normalize(event.x, event.y),
        edgeSize = (this.drawPane.showEdges && this.drawPane.edgeSize) || 0,
        x = normalized.v0 - this.drawPane.getPageLeft() - edgeSize,// - this.dragOffsetX,
        y = normalized.v1 - this.drawPane.getPageTop() - edgeSize;// - this.dragOffsetY;

    if (this.keepInParentRect) {
        var box = this._getParentRect(),
            boundingBox = this.getBoundingBox(false, this._tempBoundingBox),
            width = boundingBox[2] - boundingBox[0],
            height = boundingBox[3] - boundingBox[1];

        x = Math.max(box[0] + this.dragOffsetX, Math.min(box[2] - (width - this.dragOffsetX), x));
        y = Math.max(box[1] + this.dragOffsetY, Math.min(box[3] - (height - this.dragOffsetY), y));
    }

    if (this.onDragMove(x,y) == false) return false;


    // Do not move DrawGroups that were not the original target of the drag event.
    if (!isc.isA.DrawGroup(this) || bubbledFromDrawItem == null) {
        this.moveBy(x - this.lastDragX, y - this.lastDragY);
        // Remember the last drag mouse position so we can continue to 'moveBy' as the user
        // continues to drag.
        this.lastDragX = x;
        this.lastDragY = y;
    }

    return true;
},

//> @method drawItem.onDragMove()
// If +link{DrawItem.canDrag} is true, this notification method will be fired when the user
// drags the draw item.
// @param x (int) x-coordinate within the drawPane
// @param y (int) y-coordinate within the drawPane
// @return (boolean) return false to cancel the default behavior of allowing the shape to be drag-moved
// @visibility sgwt
//<
onDragMove : function (x, y) {
},

//> @method drawItem.dragStop()
// Notification fired when the user stops dragging this DrawItem. Will only fire if +link{canDrag,canDrag}
// is true.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.dragStop()
// @visibility drawing
//<
dragStop : function (event, info) {
    var normalized = this.drawPane.normalize(event.x, event.y),
        edgeSize = (this.drawPane.showEdges && this.drawPane.edgeSize) || 0,
        x = normalized.v0 - this.drawPane.getPageLeft() - edgeSize - this.dragOffsetX,
        y = normalized.v1 - this.drawPane.getPageTop() - edgeSize - this.dragOffsetY;
    // notification for SGWT
    this.onDragStop(x,y);
    // no need to move to x,y - this will have happened in the dragMove event(s).

    return true;
},

//> @method drawItem.onDragStop()
// If +link{DrawItem.canDrag} is true, this notification method will be fired when the user
// completes a drag on the draw item.
// @param x (int) x-coordinate within the drawPane
// @param y (int) y-coordinate within the drawPane
// @visibility sgwt
//<
onDragStop : function (x, y) {
},

dropMove : function () {
},

//> @method drawItem.mouseDown()
// Notification fired when the user presses the left mouse button on this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.mouseDown()
// @visibility drawing
//<
mouseDown : function () {

    return true;
},

//> @method drawItem.mouseUp()
// Notification fired when the user releases the left mouse button on this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.mouseUp()
// @visibility drawing
//<
mouseUp : function () {

    return true;
},

//> @method drawItem.click()
// Notification fired when the user clicks on this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.click()
// @visibility drawing
//<
click : function() {

    return true;
},

//> @method drawItem.mouseOver()
// Notification fired when the mouse enters this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.mouseOver()
// @visibility drawing
//<
mouseOver : function () {

    return true;
},

//> @method drawItem.mouseMove()
// Notification fired when the user moves the mouse over this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.mouseMove()
// @visibility drawing
//<
mouseMove : function () {

    return true;
},

//> @method drawItem.mouseOut()
// Notification fired when the mouse leaves this DrawItem.
// <p>
// Note that if this item is part of a +link{DrawGroup}, then the group's +link{DrawGroup.useGroupRect,useGroupRect}
// setting affects whether this item receives the notification. If useGroupRect is true, then
// this item will <em>not</em> receive the notification. Otherwise, the item receives the
// notification and notification bubbles up to the group.
// @include canvas.mouseOut()
// @visibility drawing
//<
mouseOut : function () {

    return true;
},

//> @attr drawItem.contextMenu (Menu : null : IRW)
// @include canvas.contextMenu
//<

//> @method drawItem.showContextMenu() (A)
// @include canvas.showContextMenu()
//<
showContextMenu : function () {


    // Support context menus on DrawItems as we do on Canvii
    var menu = this.contextMenu;
    if (menu) {
        menu.target = this;
        if (!isc.isA.Canvas(menu)) {
            menu.autoDraw = false;
            this.contextMenu = menu = this.getMenuConstructor().create(menu);
        }
        menu.showContextMenu();
    }
    return (menu == null);
},

// Support for DrawItem.menuConstructor

getMenuConstructor : function () {
    var menuClass = isc.ClassFactory.getClass(this.menuConstructor);
    if (!menuClass) {
        isc.logWarn("Class not found for menuConstructor:" + this.menuConstructor +
            ". Defaulting to isc.Menu class");
        menuClass = isc.ClassFactory.getClass("Menu");
    }
    return menuClass;
},

startHover : isc.Canvas.getInstanceProperty("startHover"),

stopHover : isc.Canvas.getInstanceProperty("stopHover"),

_handleHover : function () {
    var EH = isc.EH,
        lastMoveTarget = EH.lastMoveTarget,
        lastEvent = EH.lastEvent;
    if (!lastMoveTarget || lastMoveTarget.getHoverTarget(lastEvent) != this ||
        this.drawPane == null ||
        this.drawPane.getDrawItem(lastEvent.x, lastEvent.y) != this)
    {
        return;
    }
    this.handleHover();
},

_getHoverProperties : function () {
    return this.drawPane._getHoverProperties();
},

handleHover : function () {
    if (this.hover && this.hover() == false) return;
    if (this.showHover) {
        var hoverHTML = this.getHoverHTML();
        if (hoverHTML != null && !isc.isAn.emptyString(hoverHTML)) {
            isc.Hover.show(hoverHTML, this._getHoverProperties(), null, this);
        }
    }
},

//> @method drawItem.hover()
// If +link{canHover,canHover} is true for this DrawItem, the hover() string method will
// be fired when the user hovers over this DrawItem. If this method returns false, it will
// suppress the default behavior of showing a hover canvas if +link{showHover,showHover}
// is true.
// @return (boolean) false to cancel the hover event.
// @group hovers
// @visibility drawing
//<

//> @method drawItem.getHoverHTML()
// If +link{showHover,showHover} is true, when the user holds the mouse over this DrawItem for
// long enough to trigger a hover event, a hover canvas is shown by default. This method returns
// the contents of that hover canvas. Default implementation returns +link{prompt,prompt} -
// override for custom hover HTML. Note that returning <code>null</code> or an empty string will
// suppress the hover canvas altogether.
// @return (HTMLString) the HTML to show in the hover
// @group hovers
// @visibility drawing
//<
getHoverHTML : function () {
    return this.prompt;
},

_hoverHidden : isc.Class.NO_OP,

// end of shape events
init : function () {
    this.Super("init");
    if (this.ID !== false && (this.ID == null || window[this.ID] != this)) {
        isc.ClassFactory.addGlobalID(this);
    }
    this.drawItemID = isc.DrawItem._IDCounter++;

    if (this.drawPane) this.drawPane.addDrawItem(this, this.autoDraw, true);
},

// Drawing
// ---------------------------------------------------------------------------------------

//> @method drawItem.draw()
// Draw this item into its current +link{drawPane}.
//
// @visibility drawing
//<
// TODO exception handling for invalid generated VML/SVG markup
draw : function () {

    // be sure to set _drawn before returning
    if (this._drawn) {
        this.logDebug("DrawItem already drawn - exiting draw(). Note that this DrawItem may have been auto-drawn " +
                      "if setDrawPane() was called on it, or if DrawPane.addDrawItem() was called to add this DrawItem to a DrawPane.",
                      "drawing");
        return;
    }
    if (isc.isA.DrawGroup(this) && this.drawItems != null) {
        for (var i = 0; i < this.drawItems.length; i++) {
            if (this.drawItems[i] == null) {
                this.logInfo("drawGroup included empty entry in drawItems:"
                    + this.echo(this.drawItems));
                continue;
            }
            this.drawItems[i].drawGroup = this;
            this.drawItems[i].drawPane = this.drawPane;
        }
        this.drawItems.removeEmpty();
    }
    if (this.drawGroup) { // drawing into a drawGroup
        this.drawPane = this.drawGroup.drawPane;
    } else { // drawing directly into a drawPane
        if (!this.drawPane) this.drawPane = isc.DrawPane.getDefaultDrawPane(this.drawingType);
    }

    // add to pane.drawItems - this is essentially the set of drawItems that should draw/clear with
    // the pane.
    if (this.drawGroup) {
        if (!this.drawGroup.drawItems.contains(this)) {
            this.drawGroup.drawItems.add(this);
            this._drawKnobs();
        }
    } else {
        if (!this.drawPane.drawItems.contains(this)) {
            this.drawPane.drawItems.add(this);
            this._drawKnobs();
        }
    }

    //this.logWarn("DP:" + this.drawPane + ", dg:" + this.drawGroup);

    var dp = this.drawPane;

    // shouldDeferDrawing: for VML/SVG graphics There's a window of time between draw
    // completeing before the iframe is loaded.  If draw() is called in this window, defer the
    // draw (shouldDeferDrawing handles this if it returns true).
    if (dp.shouldDeferDrawing(this)) {
        return;
    }

    // If the DP is undrawn, we just wait for it to draw us as it draws.  The handle_drawn
    // states indicates we're being drawn as part of DrawPane's drawChildren.
    if (!dp.isDrawn() && dp.getDrawnState() != isc.Canvas.HANDLE_DRAWN) {
        return;
    }

    if (this.drawGroup) { // drawing into a drawGroup
        if (!this.drawGroup._drawn) {
            this.logWarn("Attempted draw into an undrawn group - calling draw() on the group now");
            this.drawGroup.draw();
            if (!this.drawGroup._drawn) {
                return; // drawGroup should have logged an error
            }
        }
    }
    this.drawHandle();

    this._setupEventParent();

    this._drawn = true;
},

_getQuadTreeItem : function () {
    var bboxPrime = this._getTransformedBoundingBox(true, true, true, this._tempBoundingBox);
    return {
        x: bboxPrime[0],
        y: bboxPrime[1],
        width: (bboxPrime[2] - bboxPrime[0]),
        height: (bboxPrime[3] - bboxPrime[1]),
        shape: this
    };
},

_setupEventParent : function () {
    if (this.eventParent != null) return;

    // setup eventParent - this ensures that EH events bubble properly

    this.eventParent = (this.drawGroup || this.drawPane);


    var addToQuadTree = (
            this.item == null &&
            !this.excludeFromQuadTree &&
            (!isc.isA.DrawGroup(this) || this.useGroupRect));
    for (var dg = this.drawGroup; addToQuadTree && dg != null; dg = dg.drawGroup) {

        if (dg.useGroupRect) {
            addToQuadTree = false;
        }
    }
    if (addToQuadTree) {
        var item = this.item = this._getQuadTreeItem();
        this.drawPane.quadTree.insert(item);
    }
},

_clearEventParent : function () {
    delete this.eventParent;
    if (this.item != null) {
        this.drawPane.quadTree.remove(this.item);
        delete this.item;
    }
},

_drawKnobs : function () {
    // show any specified controlKnobs
    if (this.knobs) {
        for (var i = 0; i < this.knobs.length; i++) this._showKnobs(this.knobs[i]);
    }
},

drawHandle : function () {
    var dp = this.drawPane,
        type = this.drawingType = dp.drawingType; // drawingType of drawPane wins

    // map string drawingType to faster booleans
    if (type == "vml") {
        this.drawingVML = true;
    } else if (type == "svg") {
        this.drawingSVG = true;
    } else if (type == "bitmap") {
        this.drawingBitmap = true;
    }

    if (this.drawingVML || this.drawingSVG) {
        dp._batchDraw(this);

    // bitmap - redraw the drawPane (NB: redraw is deferred, so item will be added to drawItems first)
    } else if (this.drawingBitmap) {
        dp.redrawBitmap(); // drawPane will call back to this.drawBitmap()

    } else {
        this.logWarn("DrawItem: '" + type + "' is not a supported drawingType");
        return;
    }
},

isDrawn : function () { return !!this._drawn },

_reshaped : function () {
    delete this._transform;
    this.updateControlKnobs();
    this._updateQuadTreeItem();
},

// resized / moved notifications
// This is an opportunity to update our control knobs
//> @method drawItem.moved()
// Notification method fired when this component is explicitly moved.
// Note that a component's position on the screen may also be changed due to an ancestor being
// moved. The +link{Canvas.parentMoved(),parentMoved()} method provides a notification entry point to catch
// that case as well.
//
// @param deltaX (int) horizontal difference between current and previous position
// @param deltaY (int) vertical difference between current and previous position
// @visibility drawing
//<
moved : function (deltaX, deltaY) {
},

_moved : function (deltaX, deltaY) {
    // Rotation is about the center of the DrawItem. So, when the DrawItem is moved, we need
    // to clear the cached local transform.
    delete this._transform;

    this.moved(deltaX, deltaY);
    this.updateControlKnobs();
    this._updateQuadTreeItem();
    this.saveCoordinates();
    this.moveSelection(deltaX, deltaY);
},

saveCoordinates : function () {
    if (!this.editContext) return;

    var component = this.editContext.getEditNodeArray().find("liveObject", this);

    //  can happen if we get a resized or moved notification while a component is being
    //  added or removed
    if (!component) return;

    var bb = this.getBoundingBox(false, this._tempBoundingBox);
    this.editContext.setNodeProperties(component, {
        left: bb[0],
        top: bb[1],
        width: bb[2] - bb[0],
        height: bb[3] - bb[1]
    }, true);
},

moveSelection : function (deltaX, deltaY) {
    //>EditMode
    if (!this.editingOn || !this.editContext) return;

    // Prevent infinite recursion and mutual-exclusion on selection
    // movement with a flag on the drawPane
    if (!this.drawPane._movingSelection) {
        // if this component is part of a selection, move the rest of the selected
        // components by the same amount
        var selection = this.editContext.getSelectedComponents();
        if (selection.length > 1 && selection.contains(this)) {
            this.drawPane._movingSelection = true;
            for (var i = 0; i < selection.length; i++) {
                if (selection[i] != this) {
                    selection[i].moveBy(deltaX, deltaY);
                }
            }
            this.drawPane._movingSelection = false;
        }
    }
    //<EditMode
},

//> @method   drawItem.resized()
//Observable method called whenever a DrawItem changes size.
//@visibility drawing
//<
resized : function () {
},

_resized : function () {
    // Rotation is about the center of the DrawItem. So, when the DrawItem is resized, we need
    // to clear the cached local transform.
    delete this._transform;

    this.resized();
    this.updateControlKnobs();
    this._updateQuadTreeItem();
    this.saveCoordinates();
},

rotated : function () {},

_rotated : function () {
    delete this._transform;
    this.rotated();
    this.updateControlKnobs();
    this._updateQuadTreeItem();
},

scaled: function () {},

_scaled : function () {
    delete this._transform;
    this.scaled();
    this.updateControlKnobs();
    this._updateQuadTreeItem();
},


// Knobs
// ---------------------------------------------------------------------------------------

// _showKnobs / _hideKnobs actually create and render the DrawKnobs for each specified knobType
// Implementation assumes the existance of a show<KnobType>Knobs() method for each specified
// knobType.

_showKnobs : function (knobType) {
    var functionName = isc.DrawItem._getShowKnobsFunctionName(knobType)
    if (!this[functionName]) {
        this.logWarn("DrawItem specfied with knobType:"+ knobType +
                    " but no " +  functionName + " function exists to show the knobs. Ignoring");
        return false;
    } else {
        this[functionName]();
    }
},

_hideKnobs : function (knobType) {
    var functionName = isc.DrawItem._getShowKnobsFunctionName(knobType, true)
    if (!this[functionName]) {
        this.logWarn("DrawItem specfied with knobType:"+ knobType +
                    " but no " +  functionName + " function exists to hide the knobs.");
        return false;
    } else {
        this[functionName]();
    }
},

//> @method drawItem.showKnobs()
// Shows a set of control knobs for this drawItem. Updates +link{drawItem.knobs} to include the
// specified knobType, and if necessary draws out the appropriate control knobs.
// @param knobType (KnobType or Array of KnobType) knobs to show
// @visibility drawing
//<
showKnobs : function (knobType) {
    // allow the developer to show multiple knobs with a single function call
    if (isc.isAn.Array(knobType)) {
        for (var i = 0; i < knobType.length; i++) {
            this.showKnobs(knobType[i]);
        }
        return;
    }
    if (!this.knobs) this.knobs = [];
    if (this.knobs.contains(knobType)) return;
    // Skip adding `knobType' to the knobs array if _showKnobs() did not show the knob(s) for
    // the knob type.
    if (this._showKnobs(knobType) !== false) {
        var oldMoveKnobOffset = this._getMoveKnobOffset();
        this.knobs.add(knobType);
        if (this.showResizeKnobs && !this.moveKnobOffset && this.knobs.length > 1 &&
            (knobType == "resize" || knobType == "move") &&
            (this._moveKnob != null && !this._moveKnob.destroyed) && this.knobs.contains("resize"))
        {
            var moveKnobOffset = this._getMoveKnobOffset();
            if (!oldMoveKnobOffset) oldMoveKnobOffset = [0,0];
            this._moveKnob.moveBy(moveKnobOffset[0] - oldMoveKnobOffset[0],
                                  moveKnobOffset[1] - oldMoveKnobOffset[1]);
        }
    }
},

//> @method drawItem.showAllKnobs()
// Shows all supported control knobs for this drawItem. Updates +link{drawItem.knobs} to include the
// supported knobTypes and if necessary draws out the appropriate control knobs.
// @visibility drawing
//<
showAllKnobs : function () {
    var knobs = this.getSupportedKnobs();
    this.showKnobs(knobs);
},

//> @method drawItem.hideKnobs()
// Hides a set of control knobs for this drawItem. Updates +link{drawItem.knobs} to remove the
// specified knobType, and clears any drawn knobs for this knobType.
// @param knobType (KnobType | Array of KnobType) knobs to hide
// @visibility drawing
//<
hideKnobs : function (knobType) {
    if (!this.knobs) return;
    if (!knobType) {
        knobType = this.knobs.duplicate();
    }
    if (isc.isAn.Array(knobType)) {
        for (var i = 0; i < knobType.length; i++) {
            this.hideKnobs(knobType[i]);
        }
        return;
    }
    var oldMoveKnobOffset = this._getMoveKnobOffset();
    if (this.knobs.contains(knobType)) this.knobs.remove(knobType);
    this._hideKnobs(knobType);
    if (this._moveKnob != null && !this._moveKnob.destroyed && !this.moveKnobOffset) {
        if (knobType == "resize") {
            var moveKnobOffset = this._getMoveKnobOffset();
            if (!moveKnobOffset) moveKnobOffset = [0,0];
            this._moveKnob.moveBy(moveKnobOffset[0] - oldMoveKnobOffset[0],
                                  moveKnobOffset[1] - oldMoveKnobOffset[1]);
        }
    }
},

//> @method drawItem.hideAllKnobs()
// Hides all control knobs for this drawItem. Updates +link{drawItem.knobs} to remove
// all knobTypes and clears any drawn knobs.
// @visibility drawing
//<
hideAllKnobs : function (knobType) {
    if (!this.knobs) return;
    var knobTypes = this.knobs.duplicate();
    this.hideKnobs(knobTypes);
},


// -----------------------------------------
// move control knob shared by all drawItems


//> @type MoveKnobPoint
// Specifies the starting point of a move knob with respect to its draw item. The move knob is
// positioned relative to the move knob point at the +link{DrawItem.moveKnobOffset}.
// @value "TL" Top Left corner
// @value "TR" Top Right corner
// @value "BL" Bottom Left corner
// @value "BR" Bottom Right corner
// @visibility drawing
//<


//> @attr drawItem.moveKnobPoint (MoveKnobPoint : "TL" : IR)
// If this item is showing a
// <smartclient>"move"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
// +link{drawItem.knobs,control knob}, this attribute specifies where the knob should appear
// with respect to the draw item.
// <p>
// The resize and move knobs show at the same position by default. However, when
// both knobs are shown the move knob is offset slightly to allow access to both.
// This position can be adjusted manually with +link{DrawItem.moveKnobOffset}.
// @see DrawItem.moveKnobOffset
// @visibility drawing
//<
moveKnobPoint:"TL",

//> @attr drawItem.moveKnobOffset (Array[] of int : null : IRWA)
// If this item is showing a <code>"move"</code> +link{drawItem.knobs,control knob}, this attribute
// allows you to specify an offset in pixels from the +link{drawItem.moveKnobPoint} for the
// move knob. Offset should be specified as a 2-element array of [left offset, top offset].
// <p>
// This offset overrides the built-in offset used when showing both resize and move knobs.
//
// @see DrawItem.moveKnobPoint
// @visibility drawing
//<

//> @method drawItem.setMoveKnobOffset() (A)
// Setter for +link{moveKnobOffset}.
// @param [newMoveKnobOffset] (Array[] of int) the new move knob offset. This is a 2-element array
// of [left offset, top offset]. If null, then <smartclient><code>[0,0]</code></smartclient>
// <smartgwt><code>new int[] {0, 0}</code></smartgwt> is assumed.
// @example drawKnobs
// @visibility drawing
//<
setMoveKnobOffset : function (newMoveKnobOffset) {
    var oldMoveKnobOffset = this._getMoveKnobOffset();
    this.moveKnobOffset = newMoveKnobOffset;
    if (this._moveKnob != null && !this._moveKnob.destroyed) {
        var moveKnobOffset = this._getMoveKnobOffset();
        if (moveKnobOffset == null) moveKnobOffset = [0, 0];
        if (oldMoveKnobOffset == null) oldMoveKnobOffset = [0, 0];
        this._moveKnob.moveBy(moveKnobOffset[0] - oldMoveKnobOffset[0],
                              moveKnobOffset[1] - oldMoveKnobOffset[1]);
    }
},


_moveKnobPointOffsets: {
    "TL": [-8,10],
    "TR": [8,10],
    "BL": [-8,-10],
    "BR": [8,-10]
    // Remaining points need no auto-offset
},
_getMoveKnobOffset : function () {
    if (this.moveKnobOffset) {
        return this.moveKnobOffset;
    }
    if (this.knobs == null || this.knobs.length == 0 ||
        !(this.knobs.contains("resize") && this.knobs.contains("move")))
    {
        return null;
    }
    return this._moveKnobPointOffsets[this.moveKnobPoint];
},

//> @attr drawItem.moveKnob (AutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"move"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawKnob} that allows a user to move the DrawItem with help of a knob located at
// +link{drawItem.moveKnobPoint}. Default move knob shape is green circle.
//
// @visibility drawing
//<
moveKnobDefaults: {
    cursor: "move",
    knobShapeProperties: {
        fillColor: "#00ff00"
    }
},

moveKnobConstructor: "DrawKnob",


getSupportedKnobs : function () {
    var knobTypes = isc.DrawItem._allKnobTypes,
        knobs = []
    ;
    for (var i = 0; i < knobTypes.length; i++) {
        var knobType = knobTypes[i];
        var functionName = isc.DrawItem._getShowKnobsFunctionName(knobType);
        if (this[functionName]) knobs.add(knobType);
    }
    return knobs;
},

// Helper: given a control knob position ("T", "BR", etc) return the x/y coordinates for the knob
_getKnobPosition : function (position) {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);

    var x, y;
    x = position.contains("L") ? bbox[0] :
            (position.contains("R") ? bbox[2] :
                (bbox[0] + Math.round((bbox[2] - bbox[0]) / 2)));
    y = position.contains("T") ? bbox[1] :
            (position.contains("B") ? bbox[3] :
                (bbox[1] + Math.round((bbox[3] - bbox[1]) / 2)));
    return [x, y];
},

showMoveKnobs : function () {
    if (this._moveKnob != null && !this._moveKnob.destroyed) return;

    // support customization of moveKnob via autoChild mechanism so the user can specify
    // moveKnobDefaults etc. Not currently exposed
    var position = this._getKnobPosition(this.moveKnobPoint);
    if (position == null) return;

    var x = position[0], y = position[1];
    if (window.isNaN(x) || window.isNaN(y)) return;

    var moveKnobOffset = this._getMoveKnobOffset();
    if (moveKnobOffset) {
        x += moveKnobOffset[0];
        y += moveKnobOffset[1];
        if (x < 0) x = 0;
        if (y < 0) y = 0;
    }
    this._moveKnob = this.createAutoChild("moveKnob", {
        x: x, y: y,
        drawPane: this.drawPane,
        _targetShape: this,

        updatePoints : function (x, y, dx, dy, state) {
            var drawItem = this._targetShape,
                startState = (state == "start"),
                moveState = (state == "move"),
                stopState = (state == "stop");

            if (startState) {
                var box = drawItem.getBoundingBox(false, this._tempBoundingBox),
                    x0 = x - dx,
                    y0 = y - dy;
                drawItem._dragMoveLeftOffset = x0 - box[0];
                drawItem._dragMoveRightOffset = box[2] - x0;
                drawItem._dragMoveTopOffset = y0 - box[1];
                drawItem._dragMoveBottomOffset = box[3] - y0;
            }

            if (drawItem.keepInParentRect) {
                var box = drawItem._getParentRect(),
                    x0 = x - dx,
                    y0 = y - dy;

                x = Math.max(
                    box[0] + drawItem._dragMoveLeftOffset,
                    Math.min(box[2] - drawItem._dragMoveRightOffset, x));
                y = Math.max(
                    box[1] + drawItem._dragMoveTopOffset,
                    Math.min(box[3] - drawItem._dragMoveBottomOffset, y));
                dx = x - x0;
                dy = y - y0;
            }

            if (stopState) {
                delete drawItem._dragMoveLeftOffset;
                delete drawItem._dragMoveRightOffset;
                delete drawItem._dragMoveTopOffset;
                delete drawItem._dragMoveBottomOffset;
            }

            drawItem.moveBy(dx, dy);
        }
    });
},

hideMoveKnobs : function () {
    if (this._moveKnob) {
        this._moveKnob.destroy();
        delete this._moveKnob;
    }
},


// -----------------------------------------
// resize control knob
// Implemented at the drawItem level - not exposed / supported for all drawItems

//> @type ResizeKnobPoint
// Specifies the position of a resize knob with respect to its draw item.
// @value "TL" Top Left corner
// @value "TR" Top Right corner
// @value "BL" Bottom Left corner
// @value "BR" Bottom Right corner
// @value "T" Centered on the top edge
// @value "B" Centered on the bottom edge
// @value "R" Centered on the left edge
// @value "L" Centered on thie right edge
// @visibility drawing
//<

//> @attr drawItem.resizeKnobPoints (Array of ResizeKnobPoint : ["TL","TR","BL","BR","T","R","B","L"] : IR)
// If this item is showing <smartclient>"resize"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute
// specifies the points with respect to the draw item where resize knobs should appear.
// @visibility drawing
//<
resizeKnobPoints:["TL","TR","BL","BR","T","R","B","L"],

//> @attr drawItem.cornerResizeKnob (MultiAutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"resize"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the MultiAutoChild for the
// +link{DrawKnob} that allows a user to resize the DrawItem with help of knobs located at
// corners of a bounding rectangle of current DrawItem. Default shape is red circle.
//
// @visibility drawing
//<
cornerResizeKnobDefaults: {
    knobShapeProperties: {
        _constructor: "DrawOval",
        radius : 4.5,
        lineWidth: 1,
        lineOpacity: 1,
        fillOpacity: 1,
        lineColor: "#333333",
        fillGradient: {
            x1: "0%", y1: "0%",
            x2: "0%", y2: "100%",
            colorStops: [
                {color: "#ffffff", offset: 0.15},
                {color: "#CAE9ED", offset: 0.5},
                {color: "#ffffff",   offset: 0.85}
            ]
        },
        setCenterPoint : function (x, y, drawingCoords) {
            this.creator.setCenterPoint.call(this, x, y, drawingCoords);
        }
    }
},

cornerResizeKnobConstructor: "DrawKnob",

//> @attr drawItem.sideResizeKnob (MultiAutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"resize"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the MultiAutoChild for the
// +link{DrawKnob} that allows a user to resize the DrawItem with help of knobs located at
// centers of edges of a bounding rectangle of current DrawItem. Default shape is red square.
//
// @visibility drawing
//<
sideResizeKnobDefaults: {
    knobShapeProperties: {
        _constructor: "DrawRect",
        width:7,
        height: 7,
        lineWidth: 1,
        fillOpacity: 1,
        lineColor: "#333333",
        fillGradient: {
            x1: "0%", y1: "0%",
            x2: "0%", y2: "100%",
            colorStops: [
                {color: "#ffffff", offset: 0.2},
                {color: "#C9F4F8", offset: 0.5},
                {color: "#ffffff",   offset: 0.95}
            ]
        },
        setCenterPoint : function (x, y, drawingCoords) {
            this.creator.setCenterPoint.call(this, x, y, drawingCoords);
        }
    },
    initWidget : function () {
        this.knobShapeProperties.left = this.x - this.width/2;
        this.knobShapeProperties.top = this.y - this.height/2;
        this.Super("initWidget", arguments);
    }
},

sideResizeKnobConstructor: "DrawKnob",

//> @attr drawItem.resizeOutline (AutoChild DrawRect : null : IR)
// If this item is showing <smartclient>"resize"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawRect} that draws a rectangle frame which connects all resize knobs of current
// DrawItem.
//
// @visibility drawing
//<
resizeOutlineDefaults: {
    lineWidth: 1,
    lineColor: "#007FFF",
    linePattern: "shortdot",
    autoDraw: true,
    fillOpacity: 0,
    excludeFromQuadTree: true,
    _internal:true
},

resizeOutlineConstructor: "DrawRect",

//> @attr drawItem.showResizeOutline (boolean : true : IRW)
// If this item is showing <smartclient>"resize"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#RESIZE}</smartgwt>
// +link{drawItem.knobs,control knobs} will the resize outline be shown or not.
//
// @visibility drawing
// @see resizeOutline
//<
showResizeOutline: true,


getResizeKnobProperties : function (side) {
},

showResizeKnobs : function () {
    var resizeKnobs = this._resizeKnobs;
    if (resizeKnobs != null && !resizeKnobs.isEmpty()) return;

    if (this.showResizeOutline) {
        var bbox = this.getBoundingBox(false, this._tempBoundingBox);
        this._resizeOutline = this.createAutoChild("resizeOutline", {
            left: bbox[0],
            top: bbox[1],
            width: bbox[2] - bbox[0],
            height: bbox[3] - bbox[1],
            drawPane: this.drawPane
        });
    }

    resizeKnobs = this._resizeKnobs = [];

    var positions = this.resizeKnobPoints;
    for (var i = 0; i < positions.length; i++) {
        var position = positions[i],
            coord = this._getKnobPosition(position);
        if (coord == null) continue;

        var x = coord[0], y = coord[1];
        if (window.isNaN(x) || window.isNaN(y)) continue;

        // support per-side customization via a method
        var props = isc.addProperties({}, this.getResizeKnobProperties(position), {
            _constructor: "DrawKnob",
            targetShape: this,
            point: position,
            x: x, y: y,
            drawPane: this.drawPane
        });

        // also use auto-child mechanism to pick up defaults / properties
        var name = position.length == 1? "sideResizeKnob": "cornerResizeKnob";
        var knob = this.createAutoChild(name, props);
        // override rather than observing updatePoints.
        // This allows us to cancel the drag if we'd shrink below 1x1 px in size
        knob.addProperties({
            updatePoints : function (left, top, dX, dY, state) {
                return this.targetShape.dragResizeMove(this.point, left, top, dX, dY, state);
            }
        });

        resizeKnobs.add(knob);
    }
},

// Returns a bounding box inside which a DrawItem is forced to remain while keepInParentRect
// is enabled.
_getParentRect : function () {
    var box = this.keepInParentRect,
        fromBox = isc.isAn.Array(box),
        boundLeft = (fromBox && box[0] != null ? box[0] : this.drawPane._viewBoxLeft),
        boundTop = (fromBox && box[1] != null ? box[1] : this.drawPane._viewBoxTop),
        boundRight = (fromBox && box[2] != null ? box[2] :
            (this.drawPane._viewBoxLeft + this.drawPane._viewBoxWidth)),
        boundBottom = (fromBox && box[3] != null ? box[3] :
            (this.drawPane._viewBoxTop + this.drawPane._viewBoxHeight));

    // If we're showing the move knob and the move knob is offset in the left and/or top direction,
    // then we want to adjust the parent rect bounds so that the move knob at its offset will
    // also remain in the parent rect.
    var moveKnobOffset = this._getMoveKnobOffset();
    if (this.knobs && this.knobs.contains("move") &&
        moveKnobOffset != null &&
        (moveKnobOffset[0] != 0 || moveKnobOffset[1] != 0))
    {
        var position = this._getKnobPosition(this.moveKnobPoint);
        if (position != null &&
            !window.isNaN(position[0]) &&
            !window.isNaN(position[1]))
        {
            var moveKnobPosition0 = position[0] + moveKnobOffset[0],
                moveKnobPosition1 = position[1] + moveKnobOffset[1],
                dx,
                dy;

            var bbox = this.getBoundingBox(true, this._tempBoundingBox);
            if ((dy = bbox[1] - moveKnobPosition1) > 0) {
                boundTop += dy;
            }
            if ((dx = bbox[0] - moveKnobPosition0) > 0) {
                boundLeft += dx;
            }
            if ((dy = moveKnobPosition1 - bbox[3]) > 0) {
                boundBottom -= dy;
            }
            if ((dx = moveKnobPosition0 - bbox[2]) > 0) {
                boundRight -= dx;
            }
        }
    }

    return [boundLeft, boundTop, boundRight, boundBottom];
},

//> @method drawItem.dragResizeMove() (A)
// If +link{DrawItem.canDrag} is true and the +link{knobs,control knobs} include "resize" knobs,
// then this notification method will be fired when the user drag-resizes the draw item.
// @param position (string) provides which knob of the +link{resizeKnobPoints} was dragged
// @param x (integer) new x-coordinate of the knob
// @param y (integer) new y-coordinate of the knob
// @param dX (integer) horizontal distance moved
// @param dY (integer) vertical distance moved
// @visibility drawing
//<
dragResizeMove : function (position, x, y, dX, dY, state) {
    var startState = (state == "start"),
        moveState = (state == "move"),
        stopState = (state == "stop");


    var fixedPoint;
    if (startState) {
        var isLeftKnob = position.contains("L"),
            isRightKnob = position.contains("R"),
            isTopKnob = position.contains("T"),
            isBottomKnob = position.contains("B"),
            oppositePosition = (isTopKnob ? "B" : "T") + (isLeftKnob ? "R" : "L");

        fixedPoint = this._dragResizeFixedPoint = this._getKnobPosition(oppositePosition);
    } else {
        fixedPoint = this._dragResizeFixedPoint;
    }

    // Set the new dimensions to match the dimensions of the minimum rectangle
    // spanning the fixedPoint and (x, y).
    var newLeft, newTop, newRight, newBottom;
    if (position == "L" || position == "R") {
        newTop = this.top;
        newBottom = this.top + this.height;
        newLeft = Math.min(fixedPoint[0], x);
        newRight = Math.max(fixedPoint[0], x);
    } else if (position == "T" || position == "B") {
        newLeft = this.left;
        newRight = this.left + this.width;
        newTop = Math.min(fixedPoint[1], y);
        newBottom = Math.max(fixedPoint[1], y);
    } else {
        newLeft = Math.min(fixedPoint[0], x);
        newTop = Math.min(fixedPoint[1], y);
        newRight = Math.max(fixedPoint[0], x);
        newBottom = Math.max(fixedPoint[1], y);
    }

    var newWidth = (newRight - newLeft),
        newHeight = (newBottom - newTop),
        moved = (newTop != this.top || newLeft != this.left);

    if (stopState) {
        delete this._dragResizeFixedPoint;
    }

    // If keepInParentRect is true or is some bounding box then restrict the new coordinates
    // and dimensions from the resize to within the specified bounds.
    if (this.keepInParentRect) {
        var box = this._getParentRect();
        newLeft = Math.max(newLeft, box[0]);
        newTop = Math.max(newTop, box[1]);
        newRight = Math.min(newRight, box[2]);
        newBottom = Math.min(newBottom, box[3]);
        newWidth = newRight - newLeft;
        newHeight = newBottom - newTop;
    }

    // Disallow shrinking below zero size.
    var zeroSize = (Math.abs(newWidth) < 1 || Math.abs(newHeight) < 1);
    if (!stopState && !zeroSize) {
        this._dragResizeLeft = newLeft;
        this._dragResizeTop = newTop;
        this._dragResizeWidth = newWidth;
        this._dragResizeHeight = newHeight;
    }
    if (stopState && zeroSize) {
        if (this._dragResizeLeft != null) {
            // Revert to the last dragged resize to a nonzero size.
            newLeft = this._dragResizeLeft;
            newTop = this._dragResizeTop;
            newWidth = this._dragResizeWidth;
            newHeight = this._dragResizeHeight;
        } else {
            return false;
        }
    }
    if (stopState) {
        delete this._dragResizeLeft;
        delete this._dragResizeTop;
        delete this._dragResizeWidth;
        delete this._dragResizeHeight;
    }

    if (this.onDragResizeMove(newLeft, newTop, newWidth, newHeight) === false) {
        return false;
    }

    this.resizeTo(newWidth, newHeight);
    if (moved) this.moveTo(newLeft, newTop);
    return true;
},

//>@method drawItem.onDragResizeMove()
// If +link{DrawItem.canDrag} is true and the +link{knobs,control knobs} include "resize" knobs,
// then this notification method will be fired when the user drags the resize knobs of the draw item.
// @param newX (int) new X coordinate of this draw item within the DrawPane
// @param newY (int) new Y coordinate of this draw item within the DrawPane
// @param newWidth (int) new width of this draw item
// @param newHeight (int) new height of this draw item
// @return (boolean) return false to cancel the default behavior of allowing the shape to be
// drag-resized
// @visibility sgwt
//<
onDragResizeMove : function (newX, newY, newWidth, newHeight) {},

hideResizeKnobs : function () {
    if (this._resizeKnobs) {
        this._resizeKnobs.map("destroy");
        delete this._resizeKnobs;
    }
    if (this._resizeOutline) {
        this._resizeOutline.destroy();
        delete this._resizeOutline;
    }
},

//-----------------------------------------
//other knobs
//Implemented at the drawItem level - not exposed / supported for all drawItems

//> @attr drawItem.startKnob (AutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"startPoint"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#STARTPOINT}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawKnob} for start point of current drawItem.
//
// @visibility drawing
//<
startKnobDefaults: {
},

startKnobConstructor: "DrawKnob",

//> @attr drawItem.endKnob (AutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"endPoint"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#ENDPOINT}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawKnob} for end point of current drawItem.
//
// @visibility drawing
//<
endKnobDefaults: {
},

endKnobConstructor: "DrawKnob",

// updateControlKnobs: Fired in response to moved / resized
updateControlKnobs : function () {
    if (this._moveKnob) {
        var coords = this._getKnobPosition(this.moveKnobPoint),
            moveKnobOffset = this._getMoveKnobOffset()
        ;
        if (moveKnobOffset) {
            coords = [coords[0] + moveKnobOffset[0], coords[1] + moveKnobOffset[1]];
        }
        // Gotcha: moveKnob is a Canvas, not an item, so we need to convert to
        // the screen coordinate frame
        var screenCoords = this.drawPane.drawing2screen(coords);
        this._moveKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
    }
    if (this._resizeKnobs) {
        for (var i = 0; i < this._resizeKnobs.length; i++) {
            var knob = this._resizeKnobs[i],
                coords = this._getKnobPosition(knob.point);
            var screenCoords = this.drawPane.drawing2screen(coords);
            knob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    }
    if (this._resizeOutline) {
        var bbox = this.getBoundingBox(false, this._tempBoundingBox);
        this._resizeOutline.setRect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
    }
},


setDrawPane : function (drawPane) {
    if (drawPane == this.drawPane) return;
    // Support setDrawPane(null) as an equivalent to deparent type call in Canvas - clear from
    // any parent drawPane (but keep the item around for future use)
    if (drawPane == null) {
        this.erase();
        this.drawPane = null;
        return;
    }

    drawPane.addDrawItem(this);
},

// In some cases (currently DrawLinePaths only) we use additional lines to render out arrowheads
// rather than relying on native SVG etc arrows
_drawLineStartArrow : function () {
    return false;
},
_drawLineEndArrow : function () {
    return false;
},

//Computes the closest point to `point` on the line segment from `fixedPoint` to `point` that
//intersects a bounding box.  `point` is modified in-place, so duplicate() it before calling
//this function, if necessary.
_intersectLineSegmentBox : function (fixedPoint, point, box) {
 var slope = new Array(2);
 slope[0] = 1 / (slope[1] = (point[1] - fixedPoint[1]) / (point[0] - fixedPoint[0]));

 // Loop over the four sides of the box.  On each iteration, find the intersection between
 // the constant-x or -y line that forms a side of the box and the line segment from
 // fixedPoint to point.
 for (var m = 0; m < 4; ++m) {
     var k = m % 2, l = (k + 1) % 2, s = (m < 2 ? -1 : 1), bound = box[s + 1 + k];
     var fixedPointWithinBound = !(s * fixedPoint[k] > s * bound),
         pointWithinBound = !(s * point[k] > s * bound);

     if (!pointWithinBound && fixedPointWithinBound) {

         point[k] = bound;
         point[l] = fixedPoint[l] + (bound - fixedPoint[k]) * slope[l];

     } else if (!(pointWithinBound || fixedPointWithinBound)) {
         // The line does not intersect the box, so this drag cannot be allowed.
         return null;
     }
 }
 return point;
},

// Erasing / Destroying
// ---------------------------------------------------------------------------------------

//> @method drawItem.erase()
// Erase this drawItem's visual representation and remove it from its DrawGroup (if any) and
// DrawPane.
// <P>
// To re-draw the item within the DrawPane, call +link{drawItem.draw()} again, or use
// +link{drawPane.addDrawItem()} to move to another DrawGroup.
//
// @visibility drawing
//<
// NOTE: after an erase a drawItem should be garbage unless application code holds onto it,
// since currently no global IDs are generated for DrawItems
// TODO leak testing
erase : function (erasingAll, willRedraw) {
    if (!erasingAll) { // drawPane.erase() or drawGroup.erase() just drops the whole drawItems array
        if (willRedraw) {
            if (!this._erasedDrawItems) this._erasedDrawItems = [ this ];
            else this._erasedDrawItems.add(this);
        }
        if (this.drawGroup) {
            this.drawGroup.drawItems.remove(this);
        } else if (this.drawPane) {
            if (this.drawPane.drawItems) this.drawPane.drawItems.remove(this);
            this.item && this.drawPane.quadTree.remove(this.item);
        }
    }
    if (!this._drawn) {
        // if we are pending a deferred draw clear it and exit without warning
        if (this.drawPane && this.drawPane.cancelDeferredDraw(this)) return;
        this.logInfo("DrawItem not yet drawn - exiting erase()");
        return;
    }

    if (this.drawingVML) {
        // see comments in Canvas.clearHandle(); note that VML is IE only
        var vmlHandle = this._getVMLHandle();
        if (isc.Page.isLoaded()) {
            isc.Log.logDebug("Page is loaded when erasing vml drawItem " + this.ID +
                                " - clearing outerHTML (drawPane is " +
                                            this.drawPane.ID + ")", "drawing");
            vmlHandle.outerHTML = "";
        } else {
            var vmlContainer;
            if (isc.isA.DrawLabel(this) && !this.synchTextMove) {
                vmlContainer = this.drawPane.getHandle();
            } else if (this.drawGroup && this.drawGroup.renderGroupElement) {
                vmlContainer = this.drawGroup._getVMLHandle();
            } else {
                vmlContainer = isc.Element.get(this.drawPane.getID() + "_vml_box");
            }
            isc.Log.logDebug("Page is not loaded when eraseing vml drawItem " + this.ID +
                             " - removing vmlHandle from vmlContainer " +
                             " (drawPane is " + this.drawPane.ID + ")", "drawing");
            vmlContainer.removeChild(vmlHandle);
        }
        this._vmlContainer = null;
        this._vmlHandle = null;
        this._vmlStrokeHandle = null;
        this._vmlFillHandle = null;
        this._vmlTextHandle = null;


        delete this.drawingVML;

    } else if (this.drawingSVG) {
        if (willRedraw) this._erasedSVGHandle = this._svgHandle
        else {
            if (this._svgContainer) this._svgContainer.removeChild(this._svgHandle);
        }
        this._svgDocument = null;
        this._svgContainer = null;
        this._svgHandle = null;


        delete this.drawingSVG;

    } else if (this.drawingBitmap && !erasingAll) { // drawPane.erase() will call redrawBitmap()
        this.drawPane.redrawBitmap(); // this item has been removed above
    }

    // clear up any drawn knobs
    if (this.knobs) {
        for (var i = 0; i < this.knobs.length; i++) {
            this._hideKnobs(this.knobs[i]);
        }
    }

    this._clearEventParent();
    this._drawn = false;
},


//> @method drawItem.destroy()
// Permanently destroys this DrawItem, similar to +link{Canvas.destroy()}.
//
// @visibility drawing
//<
destroy : function (destroyingAll) {
    this.Super("destroy", arguments);

    // if we're already destroyed don't do it again
    if (this.destroyed) return;

    // set a flag so we don't do unnecessary work during a destroy()
    this.destroying = true;

    this.erase(destroyingAll);

    // clear our global ID (removes the window.ID pointer to us)
    isc.ClassFactory.dereferenceGlobalID(this);

    this.destroyed = true;
},

//> @attr drawItem.destroyed (boolean : null : RA)
// Flag indicating a drawItem has been destroyed, similar to +link{canvas.destroyed}.
// @visibility drawing
//<

//> @attr drawItem.destroying (boolean : null : RA)
// Flag indicating a drawItem is mid-destruction, similar to +link{canvas.destroying}.
// @visibility drawing
//<

//--------------------------------------------------------------------------------
//  DrawItem renderers
//  These convenience methods handle the line (stroke) and fill attributes for all
//  primitives. Override these in subclasses for more advanced compound element
//  renderings.
//  NOTE: empty string is supported for no color (transparent) fillColor and
//      lineColor, so subclasses can specify transparency
//--------------------------------------------------------------------------------



vmlLineEventsOnly:false,

// NB: draw() relies on this structure to access stroke (firstChild) and fill (nextSibling)
// elements without IDs
_$solid: "solid",
_$strokedFalse: " stroked='false'",
_$filledFalse: " filled='false'",
_getElementVML : function (id) {
    var template = [this.drawPane.startTagVML(this.vmlElementName),
                    " ID='", id, "' ",

                    this.getAttributesVML()];

    var hasStroke = this._hasStroke(),
        hasFill = this._hasFill();



    if (hasStroke) {

        template.push(" strokecolor='",
                      this.lineColor,
                      // manually adjust lineWidth for global zoom
                      "' strokeweight='",
                      this.lineWidth * this.drawPane.zoomLevel, "px'");
    } else {
        template.push(this._$strokedFalse);
    }

    if (hasFill) {
        if (this.fillColor) {
            template.push(" fillcolor='", this.fillColor, "'");
        }
    } else {
        template.push(this._$filledFalse);
    }

    template.push(">");

    if (hasStroke) {
        // If this DrawItem's stroke styling deviates from the defaults, then we need to write
        // out a <STROKE> elem.
        if (this.lineOpacity != 1 || this.linePattern != this._$solid || this.startArrow || this.endArrow) {
            template.push(this._getElementStrokeVML());
        }
    }

    if (hasFill) {
        if (this.fillOpacity != 1 || this.fillGradient != null) {
            template.push(this._getElementFillVML());
        }
    }


    if (this.shadow) {
        template.push(this.drawPane.startTagVML(this._$SHADOW),
                      " COLOR='", this.shadow.color,
                      "' OFFSET='", this.shadow.offset[0], "pt,", this.shadow.offset[1], "pt'/>");
    }

    template.push(this.drawPane.endTagVML(this.vmlElementName));

    return template.join(isc._emptyString);
},

_hasStroke : function () {
    return this.lineOpacity != 0 && !!this.lineColor;
},
_hasFill : function () {
    return !this.lineEventsOnly && this.fillOpacity != 0 && (this.fillGradient != null || this.fillColor != null);
},

_getVMLHandle : function () {
    if (this._vmlHandle != null) return this._vmlHandle;
    return (this._vmlHandle = isc.Element.get("isc_DrawItem_" + this.drawItemID));
},

_$STROKE: "STROKE",
_$butt: "butt",
_$flat: "flat",
_$none: "none",
_$elementStrokeVMLTemplate: [
    ,                          // [0] startTagVML('STROKE')
    " OPACITY='",              // [1]
    ,                          // [2] this.lineOpacity
    "' DASHSTYLE='",           // [3]
    ,                          // [4] this.linePattern
    "' ENDCAP='",              // [5]
    ,                          // [6] this.lineCap
    "' STARTARROW='",          // [7]
    ,                          // [8] this.startArrow || this._$none
    "' STARTARROWWIDTH='wide' ENDARROW='", // [9]
    ,                          // [10] this.endArrow || this._$none
    "' ENDARROWWIDTH='wide'/>" // [11]
],
_getElementStrokeVML : function () {
    if (!this._hasStroke()) {
        return this.drawPane.startTagVML(this._$STROKE) + " ON='false'/>";
    } else {
        var template = this._$elementStrokeVMLTemplate;
        template[0] = this.drawPane.startTagVML(this._$STROKE);
        template[2] = this.lineOpacity;
        template[4] = this.linePattern;
        var lineCap = this.lineCap;
        template[6] = lineCap == this._$butt ? this._$flat : this.lineCap;
        template[8] = this.startArrow ? this.startArrow : this._$none;
        template[10] = this.endArrow ? this.endArrow : this._$none;
        return template.join(isc.emptyString);
    }
},

_getVMLStrokeHandle : function () {
    var vmlStrokeHandle = this._vmlStrokeHandle;
    if (vmlStrokeHandle != null) return vmlStrokeHandle;
    var vmlHandle = this._getVMLHandle();
    if (vmlHandle == null) return null;
    var firstChild = vmlHandle.firstChild;
    // The first child of our vmlHandle might be a <STROKE> elem.
    if (firstChild != null && firstChild.tagName == this._$STROKE) {
        vmlStrokeHandle = firstChild;
    // If not, need to insert a <STROKE> elem.
    } else {
        vmlStrokeHandle = isc.Element.insertAdjacentHTML(vmlHandle, "afterbegin", this._getElementStrokeVML(), true);
    }
    return (this._vmlStrokeHandle = vmlStrokeHandle);
},

_$FILL: "FILL",
_getElementFillVML : function () {
    var fillVML = this.drawPane.startTagVML(this._$FILL);

    if (!this._hasFill()) {
        fillVML += " ON='false'/>";
    } else {
        var def = (isc.isA.String(this.fillGradient) ? this.drawPane.getGradient(this.fillGradient) : this.fillGradient);
        if (def != null && !isc.isAn.emptyObject(def)) {
            var colors,
                percent;
            if (isc.DrawItem._isSimpleGradient(def) || isc.DrawItem._isLinearGradient(def)) {
                    var vector = this._normalizeLinearGradient(def);
                    var angle = def.direction || 180*Math.atan2((vector[3]-vector[1]),(vector[2]-vector[0]))/Math.PI;
                    angle = (270 - angle) % 360;
                    colors = "' COLORS='";
                    if (def.startColor && def.endColor) {
                        colors += '0% ' + def.startColor + ', 100% ' + def.endColor;
                    } else if (def.colorStops && def.colorStops.length) {
                        for (var i = 0; i < def.colorStops.length; ++i) {
                            var colorstop = def.colorStops[i];
                            if (isc.isA.String(colorstop.offset) && String(colorstop.offset).endsWith('%')) {
                                percent = colorstop.offset;
                            } else {
                                percent = colorstop.offset;
                            }
                            colors += percent + ' ' + colorstop.color;
                            if (i < def.colorStops.length - 1) {
                                colors += ", ";
                            }
                        }
                    }
                    fillVML += " TYPE='gradient' ANGLE='" + angle + colors;
            } else {
                    colors = "' COLORS='";
                    for (var i = 0; i < def.colorStops.length; ++i) {
                        var colorstop = def.colorStops[i];
                        if (isc.isA.String(colorstop.offset) && String(colorstop.offset).endsWith('%')) {
                            percent = colorstop.offset;
                        } else {
                            percent = parseFloat(colorstop.offset)*100 + '%';
                        }
                        colors += percent + ' ' + colorstop.color;
                        if (i < def.colorStops.length - 1) {
                            colors += ", ";
                        }
                    }
                    fillVML += " TYPE='gradienttitle' OPACITY='1.0' FOCUS='100%' FOCUSSIZE='0,0' FOCUSPOSITION='0.5,0.5' METHOD='linear" + colors;
            }
        } else {
            fillVML += " ON='true";
        }

        fillVML += "' OPACITY='" + this.fillOpacity + "'/>";
    }

    return fillVML;
},

_getVMLFillHandle : function () {
    var vmlFillHandle = this._vmlFillHandle;
    if (vmlFillHandle != null) return vmlFillHandle;
    var vmlHandle = this._getVMLHandle();
    if (vmlHandle == null) return null;
    var firstChild = vmlHandle.firstChild;
    if (firstChild == null || firstChild.tagName == this._$SHADOW) {
        vmlFillHandle = isc.Element.insertAdjacentHTML(vmlHandle, "afterbegin", this._getElementFillVML(), true);
    } else {
        if (firstChild.tagName == this._$FILL) {
            vmlFillHandle = firstChild;
        } else {
            var secondChild = firstChild.nextSibling;
            if (secondChild != null && secondChild.tagName == this._$FILL) {
                vmlFillHandle = secondChild;
            } else {
                vmlFillHandle = isc.Element.insertAdjacentHTML(firstChild, "afterend", this._getElementFillVML(), true);
            }
        }
    }
    return (this._vmlFillHandle = vmlFillHandle);
},

_$SHADOW: "SHADOW",

getAttributesVML : function () {
    return "" // implement in subclasses
},

//> @method drawItem.getSvgString
// Generates a string containing the SVG source of this DrawItem.
//
// <p><b>NOTE:</b> The generated SVG source assumes that the default namespace is <code>http://www.w3.org/2000/svg</code>
// and that namespace prefix <code>xlink</code> refers to namespace name <code>http://www.w3.org/1999/xlink</code>.
//
// @visibility drawing
//<
getSvgString : function (conversionContext) {
    conversionContext = conversionContext || isc.SVGStringConversionContext.create();
    var svgDefStrings = conversionContext.svgDefStrings || (conversionContext.svgDefStrings = {});

    var fill = "none", fillGradient, center;
    var gradient = this.svgFillGradient || this.fillGradient;
    if (gradient != null) {
        if (isc.isA.String(gradient)) gradient = this.drawPane.getGradient(gradient);
        if (gradient != null && !isc.isAn.emptyObject(gradient)) {
            if (gradient.id == undefined) {
                gradient.id = "gradient" + conversionContext.getNextSvgDefNumber();
            }
            var gradientID = gradient.id;
            this._useGradientID = gradientID;

            var gradientSvgString;
            if (isc.DrawItem._isSimpleGradient(gradient)) {
                gradientSvgString = this.drawPane._getSimpleGradientSvgString(gradientID, gradient, conversionContext, this);
            } else if (isc.DrawItem._isLinearGradient(gradient)) {
                gradientSvgString = this.drawPane._getLinearGradientSvgString(gradientID, gradient, conversionContext, this);
            } else {
                gradientSvgString = this.drawPane._getRadialGradientSvgString(gradientID, gradient, conversionContext, this);
            }
            gradientID = this._useGradientID;
            svgDefStrings[gradientID] = gradientSvgString;
            if (conversionContext.printForExport === false) {
                // Replace previous gradient
                this.drawPane.addGradient(gradient);
            }
            fill = "url(#" + gradientID + ")";
        }
    } else if (this.fillColor) {
        fill = this.fillColor;
    }

    var svgString = "<" + this.svgElementName +
        " id='isc_DrawItem_" + this.drawItemID +
        "' stroke-width='" + this.lineWidth + "px" +
        "' stroke-opacity='" + this.lineOpacity +
        "' stroke-dasharray='" + this._getSVGDashArray() +
        "' stroke-linecap='" + this.lineCap +
        "' stroke='" + ((this.lineColor && this.lineColor != "") ? this.lineColor : "none") +
        "' fill='" + fill +
        "' fill-opacity='" + this.fillOpacity;

    if (this.svgFilter != null && this.drawPane) {
        var filterSvgString = svgDefStrings[this.svgFilter] || (svgDefStrings[this.svgFilter] = this.drawPane._getFilterSvgString(this.svgFilter));
        if (filterSvgString) {
            svgString += "' filter='url(#" + this.svgFilter + ")";
        }
    }

    if (this.rotation && (center = this.getCenter()) && center.length === 2) {
        svgString += "' transform='rotate(" + this.rotation + " " + center[0]  + " " + center[1] + ")";
    }

    // arrow heads
    if (this.startArrow && this._drawLineStartArrow()) {
        var svgStartArrowID = this._getSVGStartArrowID();
        if (!svgDefStrings[svgStartArrowID]) {
            svgDefStrings[svgStartArrowID] = this._getArrowMarkerSvgString(svgStartArrowID, this.lineColor, this.lineOpacity, true);
        }
        svgString += "' marker-start='url(#" + svgStartArrowID + ")";
    }
    if (this.endArrow && this._drawLineEndArrow()) {
        var svgEndArrowID = this._getSVGEndArrowID();
        if (!svgDefStrings[svgEndArrowID]) {
            svgDefStrings[svgEndArrowID] = this._getArrowMarkerSvgString(svgEndArrowID, this.lineColor, this.lineOpacity, false);
        }
        svgString += "' marker-end='url(#" + svgEndArrowID + ")";
    }

    svgString += "' " + this.getAttributesSVG();

    if (this.contents) {
        svgString += ">" + isc.makeXMLSafe(this.contents) + "</" + this.svgElementName + ">";
    } else {
        svgString += "/>";
    }
    return svgString;
},

getAttributesSVG : function () {
    // implement in subclasses
    return "";
},

_normalizeLinearGradient : function (def) {
    return isc.DrawItem._normalizeLinearGradient(def, this.getBoundingBox());
},

_normalizeRadialGradient : function (def) {
    return isc.DrawItem._normalizeRadialGradient(def, this.getBoundingBox(), this.getCenter());
},

_drawLinePattern : function (x1, y1, x2, y2, context) {
    var dashArray;
    switch (this.linePattern.toLowerCase()) {
    default:
        dashArray = [10, 5];
        break;
    case "dash":
        dashArray = [10, 10];
        break;
    case "dot":
        dashArray = [1, 10];
        break;
    case "longdash":
        dashArray = [20, 10];
        break;
    case "shortdash":
        dashArray = [10, 5];
        break;
    case "shortdot":
        dashArray = [1, 5];
        break;
    }

    var dashCount = dashArray.length,
        dx = (x2 - x1), dy = (y2 - y1),
        dist = isc.Math._hypot(dx, dy),
        distRemaining = dist,
        dashIndex = 0,
        draw = true;
    this.bmMoveTo(x1, y1, context);
    while (distRemaining >= 0.1) {
        var dashLength = Math.min(dashArray[dashIndex++ % dashCount], distRemaining);
        x1 += dx * dashLength / dist;
        y1 += dy * dashLength / dist;
        this[draw ? 'bmLineTo' : 'bmMoveTo'](x1, y1, context);
        distRemaining -= dashLength;
        draw = !draw;
    }
},

drawStroke : function (context) {
    context.lineWidth = this.lineWidth;
    context.lineCap = this.lineCap;
    context.strokeStyle = this.lineColor;
    context.globalAlpha = this.lineOpacity;
    context.beginPath();
    this.drawBitmapPath(context);
    context.stroke();
},

// Note: stroke and fill are each path-ending operations.
// if transparent line or fill color (false, null, empty string), avoid drawing fill or
// filling.
// Subclasses are intended to implement drawBitmapPath() and have a series of lineTo(), arcTo()
// et al. calls.
drawBitmap : function (context) {
    context.save();
    try {
        var t = this._getLocalTransform();
        context.transform(t.m00, t.m10, t.m01, t.m11, t.m02, t.m12);

        if (this.shadow) {
            context.shadowColor = this.shadow.color;
            context.shadowBlur = this.shadow.blur;
            context.shadowOffsetX = this.shadow.offset[0];
            context.shadowOffsetY = this.shadow.offset[1];
        }
        if (this._hasFill()) {
            var fill = this.fillColor,
                def = (typeof(this.fillGradient) === 'string' ? this.drawPane.getGradient(this.fillGradient) : this.fillGradient);
            if (def != null) {
                var vector,
                    offset;
                if (isc.DrawItem._isSimpleGradient(def) || isc.DrawItem._isLinearGradient(def)) {
                    vector = this._normalizeLinearGradient(def);
                    fill = context.createLinearGradient(vector[0],vector[1],vector[2],vector[3]);
                } else {
                    vector = this._normalizeRadialGradient(def);
                    fill = context.createRadialGradient(vector[0],vector[1],vector[2],vector[3],vector[4],vector[5]);
                }
                if (def.startColor && def.endColor) {
                    fill.addColorStop(0.0,def.startColor);
                    fill.addColorStop(1.0,def.endColor);
                } else if (def.colorStops && def.colorStops.length) {
                    for (var i = 0; i < def.colorStops.length; ++i) {
                        offset = def.colorStops[i].offset;
                        if (typeof(offset) === 'string' && offset.endsWith('%')) {
                            offset = parseFloat(offset.substring(0,offset.length-1)) / 100.0;
                        }
                        fill.addColorStop(offset,def.colorStops[i].color);
                    }
                }
            }

            context.fillStyle = fill;
            context.globalAlpha = this.fillOpacity;
            context.beginPath();
            this.drawBitmapPath(context);
            context.fill();
        }
        if (this._hasStroke()) {
            if(this.shadow && fill) {
                context.shadowColor = null;
                context.shadowBlur = null;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            this.drawStroke(context);
        }
    } catch (e) {
        if (!isc.Log.supportsOnError) this._reportJSError(e);
        else this.logWarn("exception during drawBitmap(): " + e);
    } finally {
        context.restore();
    }
},


//--------------------------------------------------------------------------------
//  Arrowhead support for SVG
//--------------------------------------------------------------------------------
//  In VML, the <stroke> element's startarrow/endarrow can be set to an arrow type, which
//  provide:
//
//      -- automatic sizing, positioning, and rotation
//      -- 3 width x 3 height sizing options
//      -- automatic color and opacity matching
//      -- automatic clipping of line ends to avoid overlap (eg when the arrow is narrower than
//         the line)
//      -- hinting (at least for fine lines, ie, arrowheads do not get smaller below
//          a line width of ~2.5px, so you can still see them as arrowheads)
//
//  SVG supports arrowheads via a more generic "marker" system, where you define shapes in
//  <marker> elements and then attach those markers to points of a path. The SVG system
//  is more flexible, but very very diffcult to implement even a single arrowhead style with
//  all of the expected behaviors. Basically SVG will do:
//
//      -- automatic sizing (but no hinting)
//      -- automatic positioning (but no clipping of the path ends)
//      -- automatic rotation
//
//  Long-term, it might make sense to build our own arrowhead subsystem from the ground up;
//  then it will also work with CANVAS, and provide more customization with VML.
//  The SVG spec provides a basic description of the marker algorithm at:
//      http://www.w3.org/TR/SVG/painting.html#MarkerAlgorithm
//
//  But for now, we just want to get a single arrowhead type working in both SVG and VML. So
//  we are use the built-in "block" arrowhead in VML, and we implement the following logic
//  for markers in SVG:
//
//      1. generate marker elements (NB: no memory management/destroy yet!)
//              see methods immediately below
//
//      2. match marker color/opacity to shape lineColor/lineOpacity
//              see setLineColor() and setLineOpacity()
//
//      3. shorten path ends to avoid line/arrowhead overflow
//              specific to DrawLine and DrawPath components?
//
//      4. (future) use fixed-minimum-size markers for thin lines
//              see setLineWidth()
//
// Some FFSVG 1.5 limitations/notes:
//   -- marker-start and marker-end apparently get the same orientation on a line. not sure if
//      this is a Moz bug, or intended behavior. currently generating separate start and end
//      marker elements to work around this.
//   -- you can write marker-end by itself in the initial SVG fragment and it will be respected,
//      but you cannot set the marker-end attribute directly unless marker-start has been set.
//      workaround: set marker-start, set marker-end, clear marker-start
//      note: not seeing this any more...maybe my mistake
//
// TODO multiple arrowhead types and sizes


// Return the DOM ID for this SVG marker element
// Side effect: sets _svgStartArrowId to the returned ID
// This method is a bit messy to allow for startArrow being either an arrowStyle (normal usage)
// or an element ID (advanced usage to share a marker across multiple drawItems).
_getSVGStartArrowID : function () {
    if (!this._svgStartArrowID) {
        if (this.startArrow && this._svgDocument && this._svgDocument.getElementById(this.startArrow) &&
            (this.startArrow != "open" &&
             this.startArrow != "closed")) {
            this._svgStartArrowID = this.startArrow;
        } else {
            this._svgStartArrowID = "isc_DrawItem_" + this.drawItemID + "_startArrow";
        }
    }
    return this._svgStartArrowID;
},
// duplicate implementation for endArrow markers - see comments for _getSVGStartArrowID()
_getSVGEndArrowID : function () {
    if (!this._svgEndArrowID) {
        if (this.endArrow && this._svgDocument && this._svgDocument.getElementById(this.endArrow) &&
            (this.endArrow != "open" &&
             this.endArrow != "closed")) {
            this._svgEndArrowID = this.endArrow;
        } else {
            this._svgEndArrowID = "isc_DrawItem_" + this.drawItemID + "_endArrow";
        }
    }
    return this._svgEndArrowID;
},

_getArrowMarkerSvgString : function (id, color, opacity, start) {
    return "<marker id='" + id +
        "' viewBox='0 0 10 10' refY='5' refX='" + (start ? "10" : "0") +
        "' orient='auto' markerUnits='strokeWidth' markerWidth='4' markerHeight='3'><path d='" +
        (start ? "M 10 0 L 0 5 L 10 10 z" : "M 0 0 L 10 5 L 0 10 z") +
        "' fill='" + ((color && color != "") ? color : "none") +
        "' fill-opacity='" + opacity +
        "'/></marker>";
},

//--------------------------------------------------------------------------------
//  visibility
//--------------------------------------------------------------------------------

//> @method drawItem.show()
// Make this drawItem visible.
// @visibility drawing
//<
show : function () {
    if (!this.hidden) return;
    this.hidden = false;
    if (this.drawingVML) {
        this._getVMLHandle().style.visibility = "visible";
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "visibility", "visible");
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},


//> @method drawItem.hide()
// Hide this drawItem.
// @visibility drawing
//<
hide : function () {
    if (this.hidden) return;
    this.hidden = true;
    if (this.drawingVML) {
        this._getVMLHandle().style.visibility = "hidden";
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "visibility", "hidden");
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//--------------------------------------------------------------------------------
//  line & fill
//--------------------------------------------------------------------------------

//> @method drawItem.setLineWidth()
// Update lineWidth for this drawItem.
// @param width (int) new pixel lineWidth
// @visibility drawing
//<
setLineWidth : function (width) {
    if (width != null) this.lineWidth = width;
    if (this.drawingVML) {
        // NB: applying zoom correction - so this method is for external callers ONLY
        this._setLineWidthVML(this.lineWidth * this.drawPane.zoomLevel);
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "stroke-width", this.lineWidth+"px");
        this._svgHandle.setAttributeNS(null, "stroke-dasharray", this._getSVGDashArray()); // see _getSVGDashArray
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},
// split out so internal callers can apply zoom correction
_setLineWidthVML : function (width) {
    var vmlHandle = this._getVMLHandle();
    if (vmlHandle != null) vmlHandle.strokeweight = width + "px";
},

//> @method drawItem.setLineColor()
// Update lineColor for this drawItem.
// @param color (CSSColor) new line color.  Pass null for transparent.
// @visibility drawing
//<
setLineColor : function (color) {
    this.lineColor = color;
    if (this.drawingVML) {
        if (this._hasStroke()) {
            var vmlStrokeHandle = this._getVMLStrokeHandle();
            if (color) {
                vmlStrokeHandle.on = true;

                this._vmlHandle.strokecolor = color;
            } else {
                vmlStrokeHandle.on = false;
            }
        }
    } else if (this.drawingSVG) {
        var color = this.lineColor ? this.lineColor : "none";
        this._svgHandle.setAttributeNS(null, "stroke", color);
        // change arrowhead colors too
        if (this._svgStartArrowHandle) {
            this._svgStartArrowHandle.setAttributeNS(null, "stroke", color);
            this._svgStartArrowHandle.setAttributeNS(null, "fill", color);
        }
        if (this._svgEndArrowHandle) {
            this._svgEndArrowHandle.setAttributeNS(null, "stroke", color);
            this._svgEndArrowHandle.setAttributeNS(null, "fill", color);
        }
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},


//> @method drawItem.setLineOpacity()
// Update lineOpacity for this drawItem.
// @param opacity (float) new opacity, as a number between 0 (transparent) and 1 (opaque).
// @visibility drawing
//<
setLineOpacity : function (opacity) {
    if (opacity != null) this.lineOpacity = opacity;
    if (this.drawingVML) {
        this._getVMLStrokeHandle().opacity = opacity;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "stroke-opacity", this.lineOpacity);
        // change arrowhead opacity too
        if (this._svgStartArrowHandle) {
            this._svgStartArrowHandle.setAttributeNS(null, "stroke-opacity", this.lineOpacity);
            this._svgStartArrowHandle.setAttributeNS(null, "fill-opacity", this.lineOpacity);
        }
        if (this._svgEndArrowHandle) {
            this._svgEndArrowHandle.setAttributeNS(null, "stroke-opacity", this.lineOpacity);
            this._svgEndArrowHandle.setAttributeNS(null, "fill-opacity", this.lineOpacity);
        }
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},


//> @method drawItem.setLinePattern()
// Update linePattern for this drawItem.
// @param pattern (LinePattern) new linePattern to use
// @visibility drawing
//<
setLinePattern : function (pattern) {
    this.linePattern = pattern;
    if (this.drawingVML) {
        this._getVMLStrokeHandle().dashstyle = this.linePattern;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "stroke-dasharray", this._getSVGDashArray());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},
// Maps to emulate the preset VML dashstyles using the more powerful (but raw) SVG stroke-dasharray
// attribute. Dash and gap sizes here are multiples of lineWidth, regardless of the lineCap type.
// VML also provides shortdashdot, shortdashdotdot, dashdot, longdashdot, longdashdotdot; not
// currently emulated. To emulate a dashdot pattern will require 4 values (1 dash, 1 dot, 2 gaps);
// dashdotdot patterns will require 6 values.
_linePatternDashSizeMap : {shortdot:1, dot:1, shortdash:3, dash:4, longdash:8},
_linePatternGapSizeMap : {shortdot:1, dot:3, shortdash:1, dash:3, longdash:3},
// NB: We must take lineWidth and lineCap into account to emulate the VML behavior
//      in SVG, so setLineWidth() and setLineCap() must also reset stroke-dasharray.
_getSVGDashArray : function () {
    var lp = this.linePattern;
    if (!lp || lp == "solid" || lp == "") return "none";
    // for SVG only - Take an array of dash-gap patterns for maximum flexibility. Dash-gap patterns
    // are specified in VML (eg "4 2 1 2" for dash-dot), but they appear to be broken, at least in
    // my IE6xpsp2.
    // TODO someone else try VML dash-gap patterns (not using this join code!) in case I missed something
    // TODO could process this array to adapt to lineWidth/lineCap, as we do for the preset patterns
    if (isc.isAn.Array(lp)) return lp.join("px,")+"px";
    var dashSize = this._linePatternDashSizeMap[lp];
    var gapSize = this._linePatternGapSizeMap[lp];
    // At least in FFSVG, "round" or "square" caps extend into the gap, effectively stealing
    // 1 lineWidth from the gap size and adding it to the dash size, so we compensate here.
    if (this.lineCap != "butt") { // implies "round" or "square"
        // At least in FFSVG, the SVG renderer throws a scribble fit on a zero dash size, and
        // loses parts of the line on very small dash sizes. 0.1px seems OK for now.
        dashSize = Math.max(0.1, dashSize-1);
        gapSize++;
    }
    return (dashSize*this.lineWidth)+"px,"+(gapSize*this.lineWidth)+"px";
},


//> @method drawItem.setLineCap()
// Update lineCap for this drawItem.
// @param cap (LineCap) new lineCap to use
// @visibility drawing
//<
setLineCap : function (cap) {
    if (cap != null) this.lineCap = cap;
    if (this.drawingVML) {
        this._getVMLStrokeHandle().endcap = this.lineCap == this._$butt ? this._$flat : this.lineCap;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "stroke-linecap", this.lineCap);
        this._svgHandle.setAttributeNS(null, "stroke-dasharray", this._getSVGDashArray()); // see _getSVGDashArray
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//> @method drawItem.setShadow(shadow)
// Update shadow for this drawItem.
// @param shadow (Shadow) new shadow
// @visibility drawing
//<
setShadow: function (shadow) {
    if (shadow != null) {
        this.shadow = shadow;
    }
    if (this.drawingVML) {
    } else if (this.drawingSVG) {
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

// Arrowheads
// ---------------------------------------------------------------------------------------

//> @method drawItem.supportsStartArrow() (A)
// Does this DrawItem +link{Class.isMethodSupported(),support} +link{setStartArrow()}?
// For example, this is false for +link{DrawRect} and +link{DrawOval}, and true for +link{DrawLine}.
// @return (boolean) whether setStartArrow() is supported by this DrawItem.
// @visibility drawing
//<
supportsStartArrow : function () {
    return this.getClass().isMethodSupported("setStartArrow");
},

//> @method drawItem.setStartArrow()
// Set the arrowhead at the beginning of this path.
// <p>
// <b>NOTE:</b> Not all DrawItem classes support arrowheads. You can use +link{supportsStartArrow()}
// to dynamically check whether a DrawItem instance supports this method.
// @param arrowStyle (ArrowStyle) style of arrow to use
// @visibility drawing
//<
// NOTE: we support passing an SVG marker element ID as startArrow so we can reuse the same
// arrowheads for multiple drawItems. Note that element IDs are supported for setting only;
// if you read startArrow after draw() it will always be an arrow style.
setStartArrow : function (startArrow) {
    var wasLineArrow = this._drawLineStartArrow();
    var undef;
    if (startArrow !== undef) this.startArrow = startArrow;
    else startArrow = this.startArrow;

    var isLineArrow = this._drawLineStartArrow();

    if (wasLineArrow != isLineArrow) {
        this.setStartPoint();
    }
    // suppress rendering native block arrows with special line-arrows
    if (isLineArrow) startArrow = null;

    if (this.drawingVML) {
        this._getVMLStrokeHandle().startarrow = startArrow ? startArrow : this._$none;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "marker-start",
            (startArrow ? "url(#" + this._getSVGStartArrowID() + ")" : "none")
        );
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//> @method drawItem.supportsEndArrow() (A)
// Does this DrawItem +link{Class.isMethodSupported(),support} +link{setEndArrow()}?
// For example, this is false for +link{DrawRect} and +link{DrawOval}, and true for +link{DrawLine}.
// @return (boolean) whether setEndArrow() is supported by this DrawItem.
// @visibility drawing
//<
supportsEndArrow : function () {
    return this.getClass().isMethodSupported("setEndArrow");
},

//> @method drawItem.setEndArrow()
// Set the arrowhead at the end of this path.
// <p>
// <b>NOTE:</b> Not all DrawItem classes support arrowheads. You can use +link{supportsEndArrow()}
// to dynamically check whether a DrawItem instance supports this method.
// @param arrowStyle (ArrowStyle) style of arrow to use
// @visibility drawing
//<
setEndArrow : function (endArrow) {
    var wasLineArrow = this._drawLineEndArrow();
    var undef;
    if (endArrow !== undef) this.endArrow = endArrow;
    else endArrow = this.endArrow;

    var isLineArrow = this._drawLineEndArrow();
    if (wasLineArrow != isLineArrow) {
        this.setEndPoint()
    }

    if (isLineArrow) endArrow = null;
    if (this.drawingVML) {
        this._getVMLStrokeHandle().endarrow = endArrow ? endArrow : this._$none;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "marker-end",
            (endArrow ? "url(#" + this._getSVGEndArrowID() + ")" : "none")
        );
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//> @method drawItem.moveBy()
// Move the shape by the specified deltas for the left and top coordinate.
//
// @param dX (int) change to left coordinate in pixels
// @param dY (int) change to top coordinate in pixels
// @visibility drawing
//<
moveBy : function (dX, dY) {
    this._moved(dX, dY);
},

//> @method drawItem.resizeBy()
// Resize the shape by the specified deltas for the left and top coordinate.
//
// @param dX (int) change to left coordinate in pixels
// @param dY (int) change to top coordinate in pixels
// @visibility drawing
//<
resizeBy : function (dX, dY) {
    this._resized();
},

//> @method drawItem.resizeTo()
// Resize to the specified size
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
resizeTo : function (width,height) {
    var dX = 0, dY = 0;
    if(this.item) {
        if (width != null) dX = width - this.item.width;
        if (height != null) dY = height - this.item.height;
    }
    this.resizeBy(dX,dY);
},

//> @method drawItem.rotateBy()
// Rotate the shape by the relative rotation in degrees
// @param degrees (float) number of degrees to rotate from current orientation.
// @visibility drawing
//<
rotateBy : function (degrees) {
    this.rotation += degrees;
    delete this._transform;

    if (this.drawingVML) {
        this._getVMLHandle().style.rotation = this.rotation;
    } else if (this.drawingSVG) {
        var center = this.getCenter();
        this._svgHandle.setAttributeNS(null, "transform", "translate(" +  center[0]  + "," + center[1] + ") rotate("+this.rotation+") translate("  +  -center[0] + "," + -center[1] + ")");
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this._rotated();
},

//> @method drawItem.rotateTo()
// Rotate the shape by the absolute rotation in degrees
// @param degrees (float) number of degrees to rotate
// @visibility drawing
//<
rotateTo : function (degrees) {
    this.rotateBy(degrees - this.rotation);
},

//> @method drawItem.scaleBy()
// Scale the shape by the x, y multipliers
// @param x (float) scale in the x direction
// @param y (float) scale in the y direction
// @visibility drawing
//<
scaleBy : function (x, y) {
    var scale = this.scale;
    if (scale == null) {
        scale = this.scale = [];
    }
    scale[0] = x;
    scale[1] = y;
    delete this._transform;

    if (this.drawingVML) {

    } else if (this.drawingSVG) {

    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this._scaled();
},

//> @method drawItem.scaleTo()
// Scale the shape by the x, y multipliers
// @param x (float) scale in the x direction
// @param y (float) scale in the y direction
// @visibility drawing
//<
scaleTo : function (x, y) {
    this.scaleBy(x, y);
},


_decomposeTransform : function (transform, cx, cy) {
    var m00 = transform.m00,
        m01 = transform.m01,
        m02 = transform.m02,
        m10 = transform.m10,
        m11 = transform.m11,
        m12 = transform.m12;

    var theta = Math.atan2(m10, m11),
        c = Math.cos(theta),
        s = Math.sin(theta),
        sy = isc.Math._hypot(m10, m11),
        kDenom = (m01 * s - m00 * c),
        k = (kDenom == 0 ? 0 : -(m00 * s + m01 * c) / kDenom),
        k2p1 = isc.Math._hypot(k, 1),
        sx = isc.Math._hypot(m00, m01) / k2p1;

    if (c * m00 - s * m01 < 0) {
        sx = -sx;
    }
    if (-(k * c - s) * m10 + (k * s + c) * m11 < 0) {
        sy = -sy;
    }

    var dx = m02 - sx * (k * cy + cx) + cx * m00 + cy * m01,
        dy = m12 - sy * (-cx * s - cy * c + cy);

    return {
        translate: [dx, dy],
        scale: [sx, sy],
        rotation: theta * 180 / Math.PI,
        xShearAngle: Math.tan(k) * 180 / Math.PI,
        center: [cx, cy]
    };
},


// Fill
// ---------------------------------------------------------------------------------------

//> @method drawItem.setFillColor()
// Update fillColor for this drawItem.
// @param color (CSSColor) new fillColor to use.  Pass null for transparent.
// @visibility drawing
//<
setFillColor : function (color) {
    this.fillColor = color;
    if (this.drawingVML) {
        if (this._hasFill()) {
            var vmlFillHandle = this._getVMLFillHandle();
            if (color) {
                vmlFillHandle.on = true;
                this._vmlHandle.fillcolor = color;
            } else {
                vmlFillHandle.on = false;
            }
        }
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "fill",
            (this.fillColor && this.fillColor != "") ? this.fillColor : "none"
        );
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//> @method drawItem.setFillGradient()
// Update fillGradient for this drawItem.
// @param gradient (Gradient) new gradient to use.  Pass null for transparent.
// @visibility drawing
//<
setFillGradient : function (gradient) {
    this.gradient = gradient;
    if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "fill",
            (this.fillColor && this.fillColor != "") ? this.fillColor : "none"
        );
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//> @method drawItem.setFillOpacity()
// Update fillOpacity for this drawItem.
// @param opacity (float) new opacity, as a number between 0 (transparent) and 1 (opaque).
// @visibility drawing
//<
setFillOpacity : function (opacity) {
    if (opacity != null) this.fillOpacity = opacity;
    if (this.drawingVML) {
        this._getVMLFillHandle().opacity = this.fillOpacity;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "fill-opacity", this.fillOpacity);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

// <canvas> methods wrapped with exception handlers / logging and workarounds as needed
// ---------------------------------------------------------------------------------------

bmMoveTo : function (left, top, context) {

    var offset = (this.autoOffset && (this.lineWidth == 0 || parseInt(this.lineWidth) % 2) == 1 ? 0.5 : 0);
    try {
        context.moveTo(left+offset, top+offset);
    } catch (e) {
        this.logWarn("error on moveTo(): left: " + left + ", top: " + top +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
},

bmArc : function (centerPointX, centerPointY, radius, startRadian, endRadian, context) {
    var offset = (this.autoOffset && (this.lineWidth == 0 || parseInt(this.lineWidth) % 2) == 1 ? 0.5 : 0);
    try {
        context.arc(centerPointX+offset, centerPointY+offset, radius, startRadian, endRadian, false);
    } catch (e) {
        this.logWarn("error on arc(): centerPointX: " + centerPointX + ", centerPointY: "
                     + ", radius: " + radius + ", startRadian: " + startRadian + ", endRadian: " + endRadian +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
},

bmLineTo : function (left, top, context) {
    var offset = (this.autoOffset && (this.lineWidth == 0 || parseInt(this.lineWidth) % 2) == 1 ? 0.5 : 0);
    try {
        context.lineTo(left+offset, top+offset);
    } catch (e) {
        this.logWarn("error on lineTo(): left: " + left + ", top: " + top +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
},

bmQuadraticCurveTo : function (x1, y1, x2, y2, context) {
    var offset = (this.autoOffset && (this.lineWidth == 0 || parseInt(this.lineWidth) % 2) == 1 ? 0.5 : 0);
    try {
        context.quadraticCurveTo(x1+offset, y1+offset, x2+offset, y2+offset);
    } catch (e) {
        this.logWarn("error on quadraticCurveTo(): x1: " + x1 + ", y1: " + y1 + ", x2: " + x2 + ", y2: " + y2 +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
},

bmFillText : function (text, left, top, context) {
    try {
        context.fillText(text, left, top);
    } catch (e) {
        this.logWarn("error on fillText(): text: " + text +
                     ", left: " + left + ", top: " + top +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
},

bmStrokeText : function (text, left, top, context) {
    try {
        context.strokeText(text, left, top);
    } catch (e) {
        this.logWarn("error on fillText(): text: " + text +
                     ", left: " + left + ", top: " + top +
                     (this.logIsInfoEnabled() ? this.getStackTrace() : ""));
    }
}

}); // end DrawItem.addProperties

isc.DrawItem.addClassProperties({
    _IDCounter:0,   // for unique DOM IDs

    // ControlKnobs: see drawItem.knobs
    // For every knobType "<XXX>" we will call a show<XXX>KnobType() method
    // This method creates and caches these function names centrally (avoids reassembling strings)
    _showKnobsFunctionNameTemplate:["show", ,"Knobs"],
    _hideKnobsFunctionNameTemplate:["hide", ,"Knobs"],
    _getShowKnobsFunctionName : function (knobType, hide) {

        if (!this._knobTypeFunctionMap) {
            this._knobTypeFunctionMap = {};
        }

        if (this._knobTypeFunctionMap[knobType] == null) {
            knobType = knobType.substring(0,1).toUpperCase() + knobType.substring(1);

            this._showKnobsFunctionNameTemplate[1] = knobType;
            this._hideKnobsFunctionNameTemplate[1] = knobType;

            this._knobTypeFunctionMap[knobType] = [
                this._showKnobsFunctionNameTemplate.join(isc.emptyString),
                this._hideKnobsFunctionNameTemplate.join(isc.emptyString)
            ];
        }
        return hide ? this._knobTypeFunctionMap[knobType][1]
                     : this._knobTypeFunctionMap[knobType][0];
    },

    _allKnobTypes: ["resize","move","startPoint","endPoint","controlPoint1","controlPoint2"],


    registerEventStringMethods : function () {
        var EH = isc.EH;
        for (var eventName in EH.eventTypes) {
            // Register all events as string methods using the EventHandler's authoritative list
            this.registerStringMethods(EH.eventTypes[eventName], EH._eventHandlerArgString);
        }
    },

    _normalizeLinearGradient : function (def, boundingBox) {
        // Convert percentages to absolute values within the bounding box.
        var arr = new Array(4),
            width = Math.abs(boundingBox[2] - boundingBox[0]),
            height = Math.abs(boundingBox[3] - boundingBox[1]);
        if (def.direction != null) {
            var direction = (typeof(def.direction) === 'string' ? parseFloat(def.direction) : def.direction);
            var distance = Math.round(isc.Math._hypot(width, height)),
                radians = direction * isc.Math._radPerDeg;
            arr[0] = boundingBox[0];
            arr[2] = boundingBox[0] + distance * Math.cos(radians);
            arr[1] = boundingBox[1];
            arr[3] = boundingBox[1] + distance * Math.sin(radians);
        } else {
            // The x-coordinate of the start point of the gradient
            if (typeof(def.x1) === 'string') {
                if (def.x1.endsWith('%')) {
                    arr[0] = (boundingBox[0] + parseFloat(def.x1) * width / 100.0);
                } else {
                    arr[0] = parseFloat(def.x1);
                }
            } else if (isc.isA.Number(def.x1)) {
                arr[0] = def.x1;
            }
            // The y-coordinate of the start point of the gradient
            if (typeof(def.y1) === 'string') {
                if (def.y1.endsWith('%')) {
                    arr[1] = (boundingBox[1] + parseFloat(def.y1) * height / 100.0);
                } else {
                    arr[1] = parseFloat(def.y1);
                }
            } else if (isc.isA.Number(def.y1)) {
                arr[1] = def.y1;
            }
            // The x-coordinate of the end point of the gradient
            if (typeof(def.x2) === 'string') {
                if (def.x2.endsWith('%')) {
                    arr[2] = (boundingBox[0] + parseFloat(def.x2) * width / 100.0);
                } else {
                    arr[2] = parseFloat(def.x2);
                }
            } else if (isc.isA.Number(def.x2)) {
                arr[2] = def.x2;
            }
            // The y-coordinate of the end point of the gradient
            if (typeof(def.y2) === 'string') {
                if (def.y2.endsWith('%')) {
                    arr[3] = (boundingBox[1] + parseFloat(def.y2) * height / 100.0);
                } else {
                    arr[3] = parseFloat(def.y2);
                }
            } else if (isc.isA.Number(def.y2)) {
                arr[3] = def.y2;
            }
        }
        return arr;
    },

    _normalizeRadialGradient : function (def, boundingBox, center) {
        // Convert percentages to absolute values using the bounding box values.
        var arr = new Array(6);
        // The x-coordinate of the starting circle of the gradient
        if (typeof(def.fx) === 'string') {
            if (def.fx.endsWith('%')) {
                arr[0] = (center[0] + (parseFloat(def.fx) / 100.0));
            } else {
                arr[0] = (center[0] + parseFloat(def.fx));
            }
        } else if (def.fx != undefined) {
            arr[0] = (center[0] + def.fx);
        } else {
            arr[0] = center[0];
        }
        // The y-coordinate of the starting circle of the gradient
        if (typeof(def.fy) === 'string') {
            if (def.fy.endsWith('%')) {
                arr[1] = (center[1] + (parseFloat(def.fy) / 100.0));
            } else {
                arr[1] = (center[1] + parseFloat(def.fy));
            }
        } else if (def.fy != undefined) {
            arr[1] = (center[1] + def.fy);
        } else {
            arr[1] = center[1];
        }
        // The radius of the starting circle of the gradient
        arr[2] = 0;
        // The x-coordinate of the ending circle of the gradient
        if (typeof(def.cx) === 'string' && isc.isA.Number(boundingBox[0])) {
            if (def.cx.endsWith('%')) {
                arr[3] = (boundingBox[0] - Math.round(boundingBox[0] * parseInt(def.cx) / 100.0));
            } else {
                arr[3] = (center[0] + parseInt(def.cx));
            }
        } else {
            arr[3] = (center[0] + def.cx);
        }
        // The y-coordinate of the ending circle of the gradient
        if (typeof(def.cy) === 'string' && isc.isA.Number(boundingBox[1])) {
            if (def.cx.endsWith('%')) {
                arr[4] = (boundingBox[1] - Math.round(boundingBox[1] * parseInt(def.cy) / 100.0));
            } else {
                arr[4] = (center[1] + parseInt(def.cy));
            }
        } else {
            arr[4] = (center[1] + def.cy);
        }
        // The radius of the ending circle of the gradient
        if (typeof(def.r) === 'string' && isc.isA.Number(boundingBox[0]) && isc.isA.Number(boundingBox[1])) {
            var width = boundingBox[2] - boundingBox[0],
                height = boundingBox[3] - boundingBox[1],
                r = isc.Math._hypot(width, height);
            if (def.r.endsWith('%')) {
                arr[5] = (r * parseFloat(def.r) / 100.0);
            } else {
                arr[5] = (r * parseFloat(def.r));
            }
        } else {
            arr[5] = def.r;
        }
        return arr;
    }
});

isc.DrawItem.registerEventStringMethods();

isc.DrawItem.markUnsupportedMethods(null, ["moveTo"]);








//------------------------------------------------------------------------------------------
//> @class DrawGroup
//
// DrawItem subclass to manage a group of other DrawItem instances.
// <P>
// A DrawGroup has no local visual representation other than that of its drawItems. Adding items
// to a drawGroup allows for central event handling, and allows them to be manipulated
// (drawn, scaled, etc) together.
// <P>
// DrawItems are added to a DrawGroup by creating the DrawItems with +link{drawItem.drawGroup}
// set to a drawGroup, or by creating a DrawGroup with +link{drawGroup.drawItems}.
// <P>
// DrawGroups handle events by having an explicitly specified group rectangle
// (see +link{drawGroup.getGroupRect()}). This rectangle has no visual representation within the draw pane
// (is not visible) but any user-interactions within the specified coordinates will trigger
// group level events.
// <P>
// DrawGroups may contain other DrawGroups.
//
// @inheritsFrom DrawItem
// @treeLocation Client Reference/Drawing/DrawItem
// @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawGroup", "DrawItem").addProperties({

    //> @attr drawGroup.knobs
    // <b>NOTE:</b> DrawGroups do not support knobs.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<


    renderGroupElement:false,

    //> @attr drawGroup.useGroupRect (boolean : false : IR)
    // When should this drawGroup receive event notifications?
    // If set to <code>true</code>, the developer can specify an explicit
    // +link{drawGroup.getGroupRect(),set of coordinates}. Whenever the user interacts with this
    // rectangle, the drawGroup will be notified and the appropriate event handlers will be
    // fired. Note that rectangle need not contain all DrawItems within the group, and
    // is manually managed by the developer.<br>
    // If set to <code>false</code>, the +link{drawGroup.getGroupRect(),event rectangle}
    // coordinates are unused - instead
    // as a user interacts with specific drawItems within this group, the appropriate event handler
    // would be fired on the item, then the event would "bubble" to the
    // drawGroup, firing the appropriate event handler at the group level as well.
    // @visibility external
    //<
    useGroupRect:false,

    //> @attr drawGroup.left      (int : 0 : IRW)
    // Left coordinate of the +link{getGroupRect(),group rectangle} in pixels relative to the DrawPane.
    //
    // @visibility drawing
    //<
    left:0,

    //> @attr drawGroup.top       (int : 0 : IRW)
    // Top coordinate of the +link{getGroupRect(),group rectangle} in pixels relative to the DrawPane.
    //
    // @visibility drawing
    //<
    top:0,

    //> @attr drawGroup.width      (int : 1 : IRW)
    // Width of the +link{getGroupRect(),group rectangle} in pixels relative to the DrawPane.
    //
    // @visibility drawing
    //<
    width:1,

    //> @attr drawGroup.height      (int : 1 : IRW)
    // Height of the +link{getGroupRect(),group rectangle} in pixels relative to the DrawPane.
    //
    // @visibility drawing
    //<
    height:1,

    // ---------------------------------------------------------------------------------------

    //> @attr drawGroup.drawItems    (Array of DrawItem : null : IR)
    // Initial list of DrawItems for this DrawGroup.
    // <P>
    // DrawItems can be added to a DrawGroup after initialization by setting
    // +link{drawItem.drawGroup}.
    //
    // @visibility drawing
    //<

init : function () {
    if (!this.drawItems) this.drawItems = [];
    // ensure each drawItem knows this is its drawGroup
    for (var i = 0; i < this.drawItems.length; i++) {
        var item = this.drawItems[i];
        if (item.drawPane != null) {
            item.drawPane.removeDrawItem(item);
        }
        item.drawGroup = this;
    }
    this.Super("init");
},

//> @method drawGroup.erase()
// Erases all DrawItems in the DrawGroup.
//
// @visibility drawing
//<
erase : function (erasingAll, willRedraw) {
    // erase grouped items first
    for (var i=0; i<this.drawItems.length; i++) {
        this.drawItems[i].erase(true, // pass erasingAll flag
                                willRedraw);
    }

    this.drawItems = [];
    // then erase this group
    this.Super("erase", arguments);
},

// removeDrawItem - remove the item from this group
// This is currently used by drawPane.addDrawItem() only
removeDrawItem : function (item) {
    if (item._drawn) item.erase();
    else {
        var wasRemoved = this.drawItems.remove(item);
        if (!wasRemoved && this._eventOnlyDrawItems != null) this._eventOnlyDrawItems.remove(item);
    }
    delete item.drawGroup;
    delete item.drawPane;
},



// NB: no stroke and fill subelements for groups
vmlElementName:"GROUP",
_getElementVML : function (id, conversionContext) {

    var template = [this.drawPane.startTagVML(this.vmlElementName),
                    " ID='", id, "' ",
                    " onmousedown='return ", this.drawPane.getID(), ".mouseDown();' ",
                    this.getAttributesVML(), ">"];

    var drawItems = this.drawItems;
    if (drawItems != null && drawItems.length > 0) {
        for (var i = 0; i < drawItems.length; ++i) {
            var drawItem = drawItems[i];
            template.push(drawItem._getElementVML("isc_DrawItem_" + drawItem.drawItemID, conversionContext));
        }
    }

    template.push(this.drawPane.endTagVML(this.vmlElementName));
    return template.join(isc.emptyString);
},

getSvgString : function (conversionContext) {
    conversionContext = conversionContext || isc.SVGStringConversionContext.create();
    var svgString = "<g id='isc_DrawItem_" + this.drawItemID + "'";
    var attributesSVG = this.getAttributesSVG();
    if (attributesSVG) svgString += " " + attributesSVG;
    if (this.drawItems && this.drawItems.length) {
        svgString += ">";
        for (var i = 0; i < this.drawItems.length; ++i) {
            svgString += this.drawItems[i].getSvgString(conversionContext);
        }
        svgString += "</g>";
    } else svgString += "/>";
    return svgString;
},

draw : function () {
    if (this.drawItems == null) this.drawItems = [];
    // draw ourselves (depending on renderGroupElement,
    // may just mark as 'drawn' / set up event parent etc)
    this.Super("draw", arguments);

    // draw all children
    for (var i = 0; i < this.drawItems.length; i++) {
        // ensure drawItems[i].drawGroup is set if necessary
        this.drawItems[i].drawGroup = this;

        this.drawItems[i].draw();
    }
},

drawHandle : function () {
    if (!this.renderGroupElement) return;
    return this.Super("drawHandle", arguments);
},


drawBitmap : function (context) {
    // same loop as in drawPane.redrawBitmapNow()

    for (var i = 0, len = this.drawItems.length; i < len; ++i) {
        var drawItem = this.drawItems[i];
        if (!drawItem.hidden) {
            drawItem.drawBitmap(context);
            drawItem._setupEventParent();
            drawItem._drawn = true;
        }
    }
},


_setLineWidthVML : isc.Class.NO_OP,


//--------------------------------------------------------------------------------
//  position/translation
//--------------------------------------------------------------------------------

//> @method drawGroup.setLeft()
// Sets the left coordinate of this <code>DrawGroup</code>'s +link{DrawGroup.getGroupRect(),group rectangle}.
// Note that setting the left coordinate will not move the items in this <code>DrawGroup</code>.
//
// @param left (int) new left coordinate
// @visibility drawing
//<
setLeft : function (left) {
    this.moveTo(left, this.top);
},

//> @method drawGroup.setTop()
// Sets the top coordinate of this <code>DrawGroup</code>'s +link{DrawGroup.getGroupRect(),group rectangle}.
// Note that setting the top coordinate will not move the items in this <code>DrawGroup</code>.
//
// @param top (int) new top coordinate in pixels
// @visibility drawing
//<
setTop : function (top) {
    this.moveTo(this.left, top);
},

//> @method drawGroup.setWidth()
// Sets the width of this <code>DrawGroup</code>'s +link{DrawGroup.getGroupRect(),group rectangle}.
// Note that setting the width will not move or resize the items in this <code>DrawGroup</code>.
//
// @param width (int) new width for the group rectangle
// @visibility drawing
//<
setWidth : function (width) {
    this.width = width;
    this._resized();
},

//> @method drawGroup.setHeight()
// Sets the height of this <code>DrawGroup</code>'s +link{DrawGroup.getGroupRect(),group rectangle}.
// Note that setting the height will not move or resize the items in this <code>DrawGroup</code>.
//
// @param height (int) new height for the group rectangle
// @visibility drawing
//<
setHeight : function (height) {
    this.height = height;
    this._resized();
},

//> @method drawGroup.getGroupRect()
// This method will return an array of integers (left, top, width, height) defining the area
// of the "group rectangle" for the group. If +link{useGroupRect,useGroupRect} is true, this is
// the area of the DrawPane where user interactions will fire event notifications on this DrawGroup.
// <P>
// This is a convienence method to get the current coordinates of the
// +link{drawGroup.useGroupRect,group rectangle}.  Developers must use
// +link{drawGroup.setLeft()}, +link{drawGroup.setTop()}, +link{drawGroup.setWidth()} or
// +link{drawGroup.setHeight()} to set each coordinate directly.
// @return (Array of int) 4 element array containing left, top, width, height of the group rectangle.
// @visibility drawing
//<
getGroupRect : function () {
    return [this.left, this.top, this.width, this.height];
},

//> @method drawGroup.moveTo()
// Sets both the left and top coordinates of this <code>DrawGroup</code>'s +link{drawGroup.getGroupRect(),group rectangle}.
// Note that this does not move or resize the items in this <code>DrawGroup</code>.
//
// @param left (int) new left coordinate in pixels
// @param top (int) new top coordinate in pixels
// @visibility drawing
//<
moveTo : function (left, top) {
    this.moveBy(left - this.left, top - this.top);
},

//> @method drawGroup.moveBy()
// Updates the <code>DrawGroup</code>'s left coordinate by <code>dX</code> and the top coordinate
// by <code>dY</code>. Note that this does not move or resize the items in this <code>DrawGroup</code>.
//
// @param dX (int) change to left coordinate in pixels
// @param dY (int) change to top coordinate in pixels
// @visibility drawing
//<
moveBy : function (dX, dY) {
    // update the groupRect
    this.left += dX;
    this.top += dY;
    this.Super("moveBy", arguments);
},

//> @method drawGroup.rotateTo()
// Rotate each item in the group to the specified number of degrees.
//
// @param degrees (float)
// @visibility drawing
//<
rotateTo : function (degrees) {
    for (var i = 0; i < this.drawItems.length; i++) {
        var drawItem = this.drawItems[i];
        drawItem.rotateTo(degrees);
    }
},

//> @method drawGroup.rotateBy()
// Rotate each item in the group by the specified number of degrees.
//
// @param degrees (float)
// @visibility drawing
//<
rotateBy : function (degrees) {
    for(var i = 0; i < this.drawItems.length; ++i) {
        var drawItem = this.drawItems[i];
        drawItem.rotateBy(degrees);
    }
},

//> @method drawGroup.scaleBy()
// Scale all drawItem[] shapes by the x, y multipliers
// @param x (float) scale in the x direction
// @param y (float) scale in the y direction
// @visibility drawing
//<
scaleBy : function (x, y) {
    for(var i = 0; i < this.drawItems.length; ++i) {
        var drawItem = this.drawItems[i];
        drawItem.scaleBy(x,y);
    }
},

//> @method drawGroup.getCenter()
// Get the center point of the +link{DrawGroup.getGroupRect(),group rectangle}.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    return [this.left + Math.round(this.width / 2), this.top + Math.round(this.height / 2)];
},

//> @method drawGroup.getBoundingBox()
// Returns the left, top, (left + width), and (top + height) values
// @return (Array[] of int) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var box = (outputBox || new Array(4));
    box[0] = this.left;
    box[1] = this.top;
    box[2] = this.left + this.width;
    box[3] = this.top + this.height;
    return box;
},

isPointInPath : isc.DrawItem.getInstanceProperty("isInBounds"),

//> @method drawGroup.scaleTo()
// Scale the each item in the drawGroup by the x, y multipliers
// @param x (float) scale in the x direction
// @param y (float) scale in the y direction
// @visibility drawing
//<
scaleTo : function (x, y) {
    this.scale = this.scale || [];
    this.scale[0] += (this.scale[0]||0) + x;
    this.scale[1] += (this.scale[1]||0) + y;
    delete this._transform;
    this.scaleBy(x, y);
}


// shape events

//> @method drawGroup.dragStart()
// Notification fired when the user starts to drag this DrawGroup. Will only fire if +link{DrawItem.canDrag,canDrag}
// is true for this group.
// <P>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// <P>
// Default drag behavior will be to reposition all items in the group (and update the group
// rectangle).
// @include drawItem.dragStart()
// @visibility drawing
//<


//> @method drawGroup.dragMove()
// Notification fired for every mouseMove event triggered while the user is dragging this
// DrawGroup. Will only fire if +link{DrawItem.canDrag,canDrag} is true for this group.
// <P>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// <P>
// Default drag behavior will be to reposition all items in the group (and update the group rectangle).
// @include drawItem.dragMove()
// @visibility drawing
//<

//> @method drawGroup.dragStop()
// Notification fired when the user stops dragging this DrawGroup. Will only fire if +link{DrawItem.canDrag,canDrag}
// is true for this group.
// <P>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.dragStop()
// @visibility drawing
//<

//> @method drawGroup.mouseDown()
// Notification fired when the user presses the left mouse button on this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.mouseDown()
// @visibility drawing
//<

//> @method drawGroup.mouseUp()
// Notification fired when the user releases the left mouse button on this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.mouseUp()
// @visibility drawing
//<

//> @method drawGroup.click()
// Notification fired when the user clicks on this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.click()
// @visibility drawing
//<

//> @method drawGroup.mouseOver()
// Notification fired when the mouse enters this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.mouseOver()
// @visibility drawing
//<

//> @method drawGroup.mouseMove()
// Notification fired when the user moves the mouse over this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.mouseMove()
// @visibility drawing
//<

//> @method drawGroup.mouseOut()
// Notification fired when the mouse leaves this DrawGroup.
// <p>
// Note that if +link{useGroupRect,useGroupRect} is true, this notification will be triggered
// by the user interacting with the specified +link{getGroupRect(),group rectangle} for the group.
// If +link{useGroupRect,useGroupRect} is false, the notification will bubble up from interactions
// with individual items within the group.
// @include drawItem.mouseOut()
// @visibility drawing
//<

// end of shape events

}); // end DrawGroup.addProperties

// Mark the DrawItem line and fill attribute setters as unsupported. DrawGroups could conceivably
// be used to set default line and fill properties for their children, but currently they
// do not serve this purpose. If someone blindly called the superclass setters on all drawItems,
// they would error on DrawGroups because e.g. there are no VML stroke and fill subelements.
// TODO expand this list as additional setters are added to DrawItem
isc.DrawGroup.markUnsupportedMethods("$class does not support knobs.", ["showKnobs", "setMoveKnobOffset"]);
isc.DrawGroup.markUnsupportedMethods(null, ["setLineWidth", "setLineColor", "setLineOpacity",
        "setLinePattern", "setLineCap", "setShadow", "setFillColor", "setFillGradient", "setFillOpacity"]);
isc.DrawGroup.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawLine
//
//  DrawItem subclass to render line segments.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

//> @object Point
// X/Y position in pixels, specified as an Array with two members, for example: [30, 50]
//
// @treeLocation Client Reference/Drawing
// @visibility drawing
//<
//> @attr point.x (int: 0: IR)
// The x coordinate of this point.
//
// @visibility drawing
//<
//> @attr point.y (int: 0: IR)
// The y coordinate of this point.
//
// @visibility drawing
//<

isc.defineClass("DrawLine", "DrawItem").addProperties({
    //> @attr drawLine.knobs
    // Array of control knobs to display for this item. Each +link{knobType} specified in this
    // will turn on UI element(s) allowing the user to manipulate this DrawLine.  To update the
    // set of knobs at runtime use +link{drawItem.showKnobs()} and +link{drawItem.hideKnobs()}.
    // <p>
    // DrawLine supports the
    // <smartclient>"startPoint", "endPoint", and "move"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#STARTPOINT}, {@link com.smartgwt.client.types.KnobType#ENDPOINT},
    // and {@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
    // knob types.
    // @include DrawItem.knobs
    //<

    //> @attr drawLine.startPoint     (Point : [0,0] : IRW)
    // Start point of the line
    //
    // @visibility drawing
    //<
    startPoint: [0,0],

    //> @attr drawLine.endPoint       (Point : [100,100] : IRW)
    // End point of the line
    //
    // @visibility drawing
    //<
    endPoint: [100,100],

    //> @attr drawLine.startLeft      (int : 0 : IR)
    // Starting left coordinate of the line.  Overrides left coordinate of +link{startPoint} if
    // both are set.
    //
    // @visibility drawing
    //<
//    startLeft:0,

    //> @attr drawLine.startTop       (int : 0 : IR)
    // Starting top coordinate of the line.  Overrides top coordinate of +link{startPoint} if
    // both are set.
    //
    // @visibility drawing
    //<
//    startTop:0,

    //> @attr drawLine.endLeft        (int : 100 : IR)
    // Ending left coordinate of the line.  Overrides left coordinate of +link{endPoint} if
    // both are set.
    //
    // @visibility drawing
    //<
//    endLeft:100,

    //> @attr drawLine.endTop         (int : 100 : IR)
    // Ending top coordinate of the line.  Overrides top coordinate of +link{endPoint} if
    // both are set.
    //
    // @visibility drawing
    //<
//    endTop:100,

    svgElementName: "line",
    vmlElementName: "LINE",

init : function () {
    this.startPoint = this.startPoint.duplicate();
    this.endPoint = this.endPoint.duplicate();

    this.startPoint[0] = this.startLeft = (this.startLeft == 0 ? 0 : (this.startLeft || this.startPoint[0]));
    this.startPoint[1] = this.startTop = (this.startTop == 0 ? 0 : (this.startTop || this.startPoint[1]));
    this.endPoint[0] = this.endLeft = (this.endLeft == 0 ? 0 : (this.endLeft || this.endPoint[0]));
    this.endPoint[1] = this.endTop = (this.endTop == 0 ? 0 : (this.endTop || this.endPoint[1]));
    this.Super("init");
},


//----------------------------------------
// SVG arrowhead dependencies
//----------------------------------------

// helper methods to adjust the rendered endpoints of a line to accommodate arrowheads
_getArrowAdjustedPoints : function () {
    if (this.startArrow || this.endArrow) {
        return isc.GraphMath.trimLineEnds(
            this.startLeft, this.startTop, this.endLeft, this.endTop,
            this.startArrow ? this.lineWidth*3 : 0,
            this.endArrow ? this.lineWidth*3 : 0
        );
    } else {
        return [this.startLeft, this.startTop, this.endLeft, this.endTop];
    }
},

// changing the line width or arrows will affect the size
// of the arrows, so call setStartPoint and setEndPoint to update the size of the line segment
// (setStartPoint will take care of the endPoint as well if necessary)
setLineWidth : function (width) {
    this.Super("setLineWidth", arguments);
    if (this.drawingSVG) this.setStartPoint();
},
setStartArrow : function (startArrow) {
    this.Super("setStartArrow", arguments);
    if (this.drawingSVG) this.setStartPoint();
},
setEndArrow : function (endArrow) {
    this.Super("setEndArrow", arguments);
    // NB: cannot use setStartPoint here, since we might be clearing endArrow
    if (this.drawingSVG) this.setEndPoint();
},


//----------------------------------------
//  DrawLine renderers
//----------------------------------------

getAttributesVML : function () {
    return isc.SB.concat(
          "FROM='", this.startLeft, " ", this.startTop,
            "' TO='", this.endLeft, " ", this.endTop,
            "'");
},

getAttributesSVG : function () {
    // SVG lines must be shortened to accommodate arrowheads
    var points = this._getArrowAdjustedPoints();
    return  "x1='" + points[0] +
            "' y1='" + points[1] +
            "' x2='" + points[2] +
            "' y2='" + points[3] +
            "'";
},

drawBitmapPath : function (context) {

    var offset = (this.lineWidth == 0 || parseInt(this.lineWidth) % 2) == 1 ? 0.5 : 0,
        startLeft = parseFloat(this.startLeft)+offset,
        startTop = parseFloat(this.startTop)+offset,
        endLeft = parseFloat(this.endLeft)+offset,
        endTop = parseFloat(this.endTop)+offset,
        angle, arrowDelta = 10, originX, originY;
    if (this.startArrow == "open") {
        context.save();
        context.beginPath();
        context.strokeStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(startLeft,startTop,endLeft,endTop);
        originX = startLeft;
        originY = startTop;
        context.scale(1,1);
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(arrowDelta,-arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(arrowDelta,arrowDelta, context);
        context.stroke();
        context.restore();
    } else if (this.startArrow == "block") {
        context.save();
        context.beginPath();
        context.fillStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(startLeft,startTop,endLeft,endTop);
        originX = startLeft;
        originY = startTop;
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(arrowDelta,-arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(arrowDelta,arrowDelta, context);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
    if (this.endArrow == "open") {
        context.save();
        context.beginPath();
        context.strokeStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(startLeft,startTop,endLeft,endTop);
        originX = endLeft;
        originY = endTop;
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(-arrowDelta,arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(-arrowDelta,-arrowDelta, context);
        context.stroke();
        context.restore();
    } else if (this.endArrow == "block") {
        context.save();
        context.beginPath();
        context.fillStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(startLeft,startTop,endLeft,endTop);
        originX = endLeft;
        originY = endTop;
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(-arrowDelta,arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(-arrowDelta,-arrowDelta, context);
        context.closePath();
        context.fill();
        context.restore();
    }
    if(this.linePattern.toLowerCase() !== "solid") {
        this._drawLinePattern(startLeft, startTop, endLeft, endTop, context);
    } else {
        this.bmMoveTo(this.startLeft, this.startTop, context);
        this.bmLineTo(this.endLeft, this.endTop, context);
    }
},

//----------------------------------------
//  DrawLine attribute setters
//----------------------------------------

// NOTE: setStartPoint/EndPoint doc is @included, use generic phrasing

//> @method drawLine.setStartPoint()
// Update the startPoint
//
// @param left (int) left coordinate for start point, in pixels
// @param top (int) top coordinate for start point, in pixels
// @visibility drawing
//<
setStartPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    if (left != null) {
        this.startLeft = left;
        if (this.startPoint) this.startPoint[0] = left;
    }
    if (top != null) {
        this.startTop = top;
        if (this.startPoint) this.startPoint[1] = top;
    }
    if (this.drawingVML) {
        this._getVMLHandle().from = this.startLeft + " " + this.startTop;
    } else if (this.drawingSVG) {
        // SVG lines must be shortened to accommodate arrowheads
        var points = this._getArrowAdjustedPoints();
        this._svgHandle.setAttributeNS(null, "x1", points[0]);
        this._svgHandle.setAttributeNS(null, "y1", points[1]);
        if (this.endArrow) { // changing startPoint also changes the angle of the endArrow
            this._svgHandle.setAttributeNS(null, "x2", points[2]);
            this._svgHandle.setAttributeNS(null, "y2", points[3]);
        }
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

//> @method drawLine.setEndPoint()
// Update the endPoint
//
// @param left (int) left coordinate for end point, in pixels
// @param top (int) top coordinate for end point, in pixels
// @visibility drawing
//<
setEndPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    if (left != null) {
        this.endLeft = left;
        if (this.endPoint) this.endPoint[0] = left;
    }
    if (top != null) {
        this.endTop = top;
        if (this.endPoint) this.endPoint[1] = top;
    }
    if (this.drawingVML) {
        this._getVMLHandle().to = this.endLeft + " " + this.endTop;
    } else if (this.drawingSVG) {
        // SVG lines must be shortened to accommodate arrowheads
        var points = this._getArrowAdjustedPoints();
        this._svgHandle.setAttributeNS(null, "x2", points[2]);
        this._svgHandle.setAttributeNS(null, "y2", points[3]);
        if (this.startArrow) { // changing endPoint also changes the angle of the startArrow
            this._svgHandle.setAttributeNS(null, "x1", points[0]);
            this._svgHandle.setAttributeNS(null, "y1", points[1]);
        }
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

//> @method drawLine.getBoundingBox()
// Returns a bounding box for the <code>DrawLine</code>, taking into account the
// +link{DrawItem.lineWidth,lineWidth}.
//
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var x1 = this.startPoint[0],
        y1 = this.startPoint[1],
        x2 = this.endPoint[0],
        y2 = this.endPoint[1],
        dY = y2 - y1,
        dX = x2 - x1;

    // Calculate the angle and length of the line segment. We model the line as a filled rectangle
    // from (-halfLineWidth, -halfLineWidth) to (l + halfLineWidth, halfLineWidth) that is rotated
    // about (0, 0) by `a' and then translated to (x1, y1). From this perspective, all we're doing
    // is a _getTransformedBoundingBox() calculation.

    var a = Math.atan2(dY, dX) / isc.Math._radPerDeg,
        l = isc.Math._hypot(dX, dY),
        bbox = (outputBox || new Array(4));

    if (includeStroke != true || !this._hasStroke()) {
        bbox[0] = bbox[1] = bbox[3] = 0;
        bbox[2] = l;
    } else {
        var halfLineWidth = this.lineWidth / 2;
        bbox[0] = bbox[1] = -halfLineWidth;
        bbox[2] = l + halfLineWidth;
        bbox[3] = halfLineWidth;
    }

    var t = isc.AffineTransform.getTranslateTransform(x1, y1)
                               .rotate(a, 0, 0);

    var v1 = t.transform(bbox[0], bbox[1]),
        v2 = t.transform(bbox[2], bbox[1]),
        v3 = t.transform(bbox[2], bbox[3]),
        v4 = t.transform(bbox[0], bbox[3]);

    bbox[0] = Math.min(v1.v0, v2.v0, v3.v0, v4.v0);
    bbox[1] = Math.min(v1.v1, v2.v1, v3.v1, v4.v1);
    bbox[2] = Math.max(v1.v0, v2.v0, v3.v0, v4.v0);
    bbox[3] = Math.max(v1.v1, v2.v1, v3.v1, v4.v1);
    return bbox;
},

//> @method drawLine.getCenter()
// Get the midpoint of the line.
// @return (Point) the midpoint
// @visibility drawing
//<
getCenter : function () {
    return [this.startPoint[0] + Math.round((this.endPoint[0]-this.startPoint[0])/2),
      this.startPoint[1] + Math.round((this.endPoint[1]-this.startPoint[1])/2)];
},

//> @method drawLine.isPointInPath()
// @include DrawItem.isPointInPath()
//<
isPointInPath : function (x, y) {

    var tolerance = Math.max(this.lineWidth / 2, 2) + this.hitTolerance;
    var normalized = this._normalize(x, y);
    return isc.Math.euclideanDistanceToLine(this.startLeft, this.startTop, this.endLeft, this.endTop, normalized.v0, normalized.v1) < tolerance;
},

showKnobs : function (knobType) {
    if (isc.isAn.Array(knobType)) return this.Super("showKnobs", arguments);

    var oldMoveKnobOffset = this._getMoveKnobOffset();
    this.Super("showKnobs", arguments);
    if (this.knobs.length > 1 && (knobType == "move" || knobType == "startPoint" || knobType == "endPoint") &&
        (this._moveKnob != null && !this._moveKnob.destroyed) &&
        (this.knobs.contains("startPoint") || this.knobs.contains("endPoint")))
    {
        var moveKnobOffset = this._getMoveKnobOffset();
        if (moveKnobOffset != null) {
            if (!oldMoveKnobOffset) oldMoveKnobOffset = [0, 0];
            this._moveKnob.moveBy(moveKnobOffset[0] - oldMoveKnobOffset[0],
                                  moveKnobOffset[1] - oldMoveKnobOffset[1]);
        }
    }
},

showResizeKnobs : null,
hideResizeKnobs : null,

_getKnobPosition : function (position) {
    return position.contains("R") ? this.endPoint : this.startPoint;
},

_getMoveKnobOffset : function () {
    if (this.moveKnobOffset != null) {
        return this.moveKnobOffset;
    }
    if (this.knobs == null || this.knobs.length == 0 || !this.knobs.contains("move")) {
        return null;
    }
    var knobPosition = this._getKnobPosition(this.moveKnobPoint);

    if ((knobPosition === this.startPoint && !this.knobs.contains("startPoint")) ||
        (knobPosition === this.endPoint && !this.knobs.contains("endPoint")))
    {
        return null;
    }
    return this._moveKnobPointOffsets[this.moveKnobPoint];
},

// Support controlKnobs for start/endPoints
// (Documented under DrawKnobs type definition)
showStartPointKnobs : function () {
    if (this._startKnob != null && !this._startKnob.destroyed) return;

    this._startKnob = this.createAutoChild("startKnob", {
        x: this.startLeft,
        y: this.startTop,
        drawPane: this.drawPane,
        _targetShape: this,

        updatePoints : function (x, y, dx, dy, state) {
            var drawItem = this._targetShape;
            var startState = (state == "start"),
                moveState = (state == "move"),
                stopState = (state == "stop");

            var fixedPoint;
            if (startState) {
                fixedPoint = drawItem._dragStartPointFixedPoint = drawItem.endPoint.duplicate();
            } else {
                fixedPoint = drawItem._dragStartPointFixedPoint;
            }

            if (drawItem.keepInParentRect) {
                var box = drawItem._getParentRect(),
                    point = drawItem._intersectLineSegmentBox(fixedPoint, [x, y], box);

                if (point == null) {
                    if (stopState) {
                        delete drawItem._dragStartPointFixedPoint;
                    }
                    return false;
                } else {
                    x = point[0];
                    y = point[1];
                }
            } else if (stopState) {
                delete drawItem._dragStartPointFixedPoint;
            }

            drawItem.setStartPoint(x, y);
        }
    });
},

hideStartPointKnobs : function () {
    if (this._startKnob) {
        this._startKnob.destroy();
        delete this._startKnob;
    }
},

showEndPointKnobs : function () {
    if (this._endKnob != null && !this._endKnob.destroyed) return;

    this._endKnob = this.createAutoChild("endKnob", {
        x: this.endLeft,
        y: this.endTop,
        drawPane: this.drawPane,
        _targetShape: this,

        updatePoints : function (x, y, dx, dy, state) {
            var drawItem = this._targetShape,
                startState = (state == "start"),
                moveState = (state == "move"),
                stopState = (state == "stop"),
                fixedPoint;

            if (startState) {
                fixedPoint = drawItem._dragEndPointFixedPoint = drawItem.startPoint.duplicate();
            } else {
                fixedPoint = drawItem._dragEndPointFixedPoint;
            }

            if (drawItem.keepInParentRect) {
                var box = drawItem._getParentRect(),
                    point = drawItem._intersectLineSegmentBox(fixedPoint, [x, y], box);

                if (point == null) {
                    if (stopState) {
                        delete drawItem._dragEndPointFixedPoint;
                    }
                    return false;
                } else {
                    x = point[0];
                    y = point[1];
                }
            } else if (stopState) {
                delete drawItem._dragEndPointFixedPoint;
            }

            drawItem.setEndPoint(x, y);
        }
    });
},

hideEndPointKnobs : function () {
    if (this._endKnob) {
        this._endKnob.destroy();
        delete this._endKnob;
    }
},

//> @method drawLine.moveBy()
// Move both the start and end points of the line by a relative amount.
//
// @param left (int) change to left coordinate in pixels
// @param top (int) change to top coordinate in pixels
// @visibility drawing
//<
moveBy : function (x, y) {
    this.startLeft += x;
    this.startTop += y;
    this.endLeft += x;
    this.endTop += y;
    this.startPoint[0] = this.startLeft;
    this.startPoint[1] = this.startTop;
    this.endPoint[0] = this.endLeft;
    this.endPoint[1] = this.endTop;
    if (this.drawingVML) {
        var vmlHandle = this._getVMLHandle();
        vmlHandle.from = this.startLeft + " " + this.startTop;
        vmlHandle.to = this.endLeft + " " + this.endTop;
    } else if (this.drawingSVG) {
        // could cache the adjusted points, since their relative positions do not change
        var points = this._getArrowAdjustedPoints();
        this._svgHandle.setAttributeNS(null, "x1", points[0]);
        this._svgHandle.setAttributeNS(null, "y1", points[1]);
        this._svgHandle.setAttributeNS(null, "x2", points[2]);
        this._svgHandle.setAttributeNS(null, "y2", points[3]);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("moveBy", arguments);
},

//> @method drawLine.moveTo()
// Move both the start and end points of the line, such that the startPoint ends up at the
// specified coordinate and the line length and angle are unchanged.
//
// @param left (int) new startLeft coordinate in pixels
// @param top (int) new startTop coordinate in pixels
// @visibility drawing
//<
moveTo : function (left, top) {
    this.moveBy(left - this.startLeft, top - this.startTop);
},

updateControlKnobs : function () {
    // update the position of our start/end point knobs when we update our other control points
    this.Super("updateControlKnobs", arguments);
    if (this._startKnob) {
        var left = this.startLeft,
            top = this.startTop,
            screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
        this._startKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
    }
    if (this._endKnob) {
        var left = this.endLeft,
            top = this.endTop,
            screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
        this._endKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
    }
}

}) // end DrawLine.addProperties








//------------------------------------------------------------------------------------------
//> @class DrawRect
//
//  DrawItem subclass to render rectangle shapes, optionally with rounded corners.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawRect", "DrawItem").addProperties({
    //> @attr drawRect.left (int : 0 : IRW)
    // Left coordinate in pixels relative to the DrawPane.
    // @visibility drawing
    //<
    left:0,

    //> @attr drawRect.top (int : 0 : IRW)
    // Top coordinate in pixels relative to the DrawPane.
    // @visibility drawing
    //<
    top:0,

    // NOTE: width/height @included elsewhere so should be phrased generically

    //> @attr drawRect.width        (int : 100 : IRW)
    // Width in pixels.
    // @visibility drawing
    //<
    width:100,

    //> @attr drawRect.height       (int : 100 : IRW)
    // Height in pixels.
    // @visibility drawing
    //<
    height:100,

    //> @attr drawRect.rounding      (float : 0 : IR)
    // Rounding of corners, from 0 (square corners) to 1.0 (shorter edge is a semicircle).
    //
    // @visibility drawing
    //<
    rounding:0,

    //> @attr drawRect.lineCap     (LineCap : "butt" : IRW)
    // Style of drawing the endpoints of a line.
    // <P>
    // Note that for dashed and dotted lines, the lineCap style affects each dash or dot.
    //
    // @group line
    // @visibility drawing
    //<
    lineCap: "butt",

    svgElementName: "rect",
    vmlElementName: "ROUNDRECT",


//----------------------------------------
//  DrawRect renderers
//----------------------------------------

getAttributesVML : function () {
    var left = this.left,
        top = this.top,
        width = this.width,
        height = this.height;
    if (width < 0) {
        left += width;
        width = -width;
    }
    if (height < 0) {
        top += height;
        height = -height;
    }

    return isc.SB.concat(
        "STYLE='position:absolute; left:", left,
            "px; top:", top,
            "px; width:", width,
            "px; height:", height, "px;'",

            " ARCSIZE='"+this.rounding/2+"'");
},

getAttributesSVG : function () {
    var left = this.left,
        top = this.top,
        width = this.width,
        height = this.height;
    if (width < 0) {
        left += width;
        width = -width;
    }
    if (height < 0) {
        top += height;
        height = -height;
    }
    return isc.SB.concat(
        "x='", left, "' y='", top, "' width='", width, "' height='", height, "'",
        (this.rounding ? (" rx='" + (this.rounding * Math.min(width, height) / 2) + "'") : ""));
},

drawBitmapPath : function (context) {
    var left = this.left,
        top = this.top,
        width = this.width,
        height = this.height;
    if (width < 0) {
        left += width;
        width = -width;
    }
    if (height < 0) {
        top += height;
        height = -height;
    }
    var right = left + width,
        bottom = top + height;

    if (this.rounding == 0) {
        this.bmMoveTo(left, top, context);
        if (this.linePattern.toLowerCase() !== "solid") {
            this._drawLinePattern(left, top, right, top, context);
            this._drawLinePattern(right, top, right, bottom, context);
            this._drawLinePattern(right, bottom, left, bottom, context);
            this._drawLinePattern(left, bottom, left, top, context);
        } else {
            this.bmLineTo(right, top, context);
            this.bmLineTo(right, bottom, context);
            this.bmLineTo(left, bottom, context);
            this.bmLineTo(left, top, context);
        }
    } else {

        var r = (this.rounding * Math.min(width, height) / 2);
        this.bmMoveTo(left + r, top, context);
        this.bmLineTo(right - r, top, context);
        this.bmQuadraticCurveTo(right, top, right, top + r, context);
        this.bmLineTo(right, bottom - r, context);
        this.bmQuadraticCurveTo(right, bottom, right - r, bottom, context);
        this.bmLineTo(left + r, bottom, context);
        this.bmQuadraticCurveTo(left, bottom, left, bottom - r, context);
        this.bmLineTo(left, top + r, context);
        this.bmQuadraticCurveTo(left, top, left + r, top, context);
    }
    context.closePath();
},

//----------------------------------------
//  DrawRect attribute setters
//----------------------------------------

//> @method drawRect.setCenter()
// Move the drawRect such that it is centered over the specified coordinates.
// @param left (int) left coordinate for new center position
// @param top (int) top coordinate for new center postiion
// @visibility drawing
//<
setCenter : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    if (left != null) left = left - Math.round(this.width/2);
    if (top != null) top = top - Math.round(this.height/2);

    this.moveTo(left,top);
},

//> @method drawRect.getCenter()
// Get the center point of the rectangle.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    return [this.left + Math.round(this.width/2), this.top + Math.round(this.height/2)];
},

//> @method drawRect.getBoundingBox()
// Returns the top, left, top+height, left+width
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var bbox = (outputBox || new Array(4));
    bbox[0] = this.left;
    bbox[1] = this.top;
    bbox[2] = this.left + this.width;
    bbox[3] = this.top + this.height;
    return includeStroke != true ? bbox : this._adjustBoundingBoxForStroke(bbox);
},

isPointInPath : isc.DrawItem.getInstanceProperty("isInBounds"),

//> @method drawRect.moveBy()
// Move the drawRect by the specified delta
// @param dX (int) number of pixels to move horizontally
// @param dY (int) number of pixels to move vertically
// @visibility drawing
//<
moveBy : function (dX, dY) {
    this.left += dX;
    this.top += dY;
    if (this.drawingVML) {
        var vmlHandleStyle = this._getVMLHandle().style;
        vmlHandleStyle.left = this.left;
        vmlHandleStyle.top = this.top;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "x", this.left);
        this._svgHandle.setAttributeNS(null, "y", this.top);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("moveBy", arguments);
},

//> @method drawRect.moveTo()
// Move the drawRect to the specified position
// @param left (int) new left coordinate
// @param top (int) new top coordinate
// @visibility drawing
//<
moveTo : function (left,top) {
    this.moveBy(left - this.left, top - this.top);
},

//> @method drawRect.setLeft()
// Set the left coordinate of the drawRect
// @param left (int) new left coordinate
// @visibility drawing
//<
setLeft : function (left) {
    this.moveTo(left, this.top);
},

//> @method drawRect.setTop()
// Set the top coordinate of the drawRect
// @param top (int) new top coordinate
// @visibility drawing
//<
setTop : function (top) {
    this.moveTo(this.left, top);
},

//> @method drawRect.resizeTo()
// Resize to the specified size
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
resizeTo : function (width,height) {
    var dX = 0, dY = 0;
    if (width != null) dX = width - this.width;
    if (height != null) dY = height - this.height;

    this.resizeBy(dX,dY);
},

//> @method drawRect.resizeBy()
// Resize by the specified delta
// @param dX (int) number of pixels to resize by horizontally
// @param dY (int) number of pixels to resize by vertically
// @visibility drawing
//<
resizeBy : function (dX, dY) {
    if (dX != null) this.width += dX;
    if (dY != null) this.height += dY;

    if (this.drawingVML) {
        var vmlHandleStyle = this._getVMLHandle().style;
        vmlHandleStyle.width = this.width;
        vmlHandleStyle.height = this.height;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "width", this.width);
        this._svgHandle.setAttributeNS(null, "height", this.height);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("resizeBy", arguments);
},


//> @method drawRect.setWidth()
// Set the width of the drawRect
// @param width (int) new width
// @visibility drawing
//<
setWidth : function (width) {
    this.resizeTo(width);
},

//> @method drawRect.setHeight()
// Set the height of the drawRect
// @param height (int) new height
// @visibility drawing
//<
setHeight : function (height) {
    this.resizeTo(null, height);
},

//> @method drawRect.setRect()
// Move and resize the drawRect to match the specified coordinates and size.
// @param left (int) new left coordinate
// @param top (int) new top coordinate
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
setRect : function (left,top,width,height) {
    this.moveTo(left,top);
    this.resizeTo(width,height);
},


//> @method drawRect.setRounding()
// Setter method for +link{drawRect.rounding}
// @param rounding (float) new rounding value. Should be between zero (a rectangle) and 1 (shorter
//   edge is a semicircle)
// @visibility drawing
//<
setRounding : function (rounding) {
    this.rounding = rounding;
    if (this.drawingVML) {

        this.erase();
        this.draw();

    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "rx", (this.rounding ?
            (this.rounding * Math.min(Math.abs(this.width), Math.abs(this.height)) / 2) :
            null));
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
}

}); // end DrawRect.addProperties

isc.DrawRect.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawOval
//
//  DrawItem subclass to render oval shapes, including circles.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawOval", "DrawItem").addProperties({

    //> @attr drawOval.left (int : 0 : IRW)
    // @include drawRect.left
    //<
    left:0,

    //> @attr drawOval.top (int : 0 : IRW)
    // @include drawRect.top
    //<
    top:0,

    //> @attr drawOval.width (int : 100 : IRW)
    // @include drawRect.width
    //<
    width:100,

    //> @attr drawOval.height (int : 100 : IRW)
    // @include drawRect.height
    //<
    height:100,

    //> @attr drawOval.centerPoint    (Point : null : IRW)
    // Center point of the oval.  If unset, derived from left/top/width/height.
    // @visibility drawing
    //<

    //> @attr drawOval.radius (int : null : IW)
    // Radius of the oval. Since this is used to initialize the +link{DrawOval.getRadiusX(),horizontal}
    // and +link{DrawOval.getRadiusY(),vertical} radii, then the oval is a circle.
    // <p>
    // If unset, the horizontal and vertical radii are set to half the +link{DrawOval.width,width}
    // and +link{DrawOval.height,height}.
    // @setter setRadius()
    // @see DrawOval.getRadiusX()
    // @see DrawOval.getRadiusY()
    // @visibility drawing
    //<

    //rx
    //ry

    svgElementName: "ellipse",
    vmlElementName: "OVAL",

// TODO review init property precedence and null/zero check
init : function () {
    // convert rect to center/radii
    if (!this.radius) this._deriveCenterPointFromRect();
    else this._deriveRectFromRadius();

    this.Super("init");
},

// Helpers to synch rect coords with specified centerPoint / radius and vice versa
_deriveRectFromRadius : function () {
    // convert center/radii to rect
    if (this.rx == null) this.rx = this.radius;
    if (this.ry == null) this.ry = this.radius;
    this.width = this.rx * 2;
    this.height = this.ry * 2;
    // support either centerpoint or direct left/top
    if (this.centerPoint != null) {
        this.left = this.centerPoint[0] - this.width/2;
        this.top = this.centerPoint[1] - this.height/2;
    } else {
        this.centerPoint = [];
        this.centerPoint[0] = this.left + this.width/2;
        this.centerPoint[1] = this.top + this.height/2;
    }
},
_deriveCenterPointFromRect : function () {
    this.centerPoint = [];
    var halfWidth = (this.width / 2) << 0,
        halfHeight = (this.height / 2) << 0;
    this.centerPoint[0] = this.left + halfWidth;
    this.centerPoint[1] = this.top + halfHeight;
    this.rx = halfWidth;
    this.ry = halfHeight;
},
//----------------------------------------
//  DrawOval renderers
//----------------------------------------

getAttributesVML : function () {
    // POSITION and SIZE attributes from VML spec did not work
    return isc.SB.concat(
        "STYLE='position:absolute;left:", this.left,
            "px;top:", this.top,
            "px;width:", this.width,
            "px;height:", this.height, "px;'");
},

getAttributesSVG : function () {
    return  "cx='" + this.centerPoint[0] +
            "' cy='" + this.centerPoint[1] +
            "' rx='" + this.rx +
            "' ry='" + this.ry +
            "'"
},

//> @method drawOval.getBoundingBox()
// Returns the top, left, top+height, left+width
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var bbox = (outputBox || new Array(4));
    bbox[0] = this.left;
    bbox[1] = this.top;
    bbox[2] = this.left + this.width;
    bbox[3] = this.top + this.height;
    return includeStroke != true ? bbox : this._adjustBoundingBoxForStroke(bbox);
},

drawBitmapPath : function (context) {
    var kappa = 0.552284749831; // 4 * (sqrt(2) - 1) / 3
    var rx = this.rx;
    var ry = this.ry;
    var cx = this.centerPoint[0];
    var cy = this.centerPoint[1];
    context.moveTo(cx, cy - ry);
    context.bezierCurveTo(cx + (kappa * rx), cy - ry,  cx + rx, cy - (kappa * ry), cx + rx, cy);
    context.bezierCurveTo(cx + rx, cy + (kappa * ry), cx + (kappa * rx), cy + ry, cx, cy + ry);
    context.bezierCurveTo(cx - (kappa * rx), cy + ry, cx - rx, cy + (kappa * ry), cx - rx, cy);
    context.bezierCurveTo(cx - rx, cy - (kappa * ry), cx - (kappa * rx), cy - ry, cx, cy - ry);
    context.closePath();
},

//----------------------------------------
//  DrawOval attribute setters
//----------------------------------------

//> @method drawOval.setCenterPoint()
// Change the center point for this oval.
// @param left (int) left coordinate
// @param top (int) top coordinate
// @visibility drawing
//<
setCenterPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }
    var dX = 0, dY = 0;
    if (left != null) dX = left - this.centerPoint[0];
    if (top != null) dY = top - this.centerPoint[1];

    this.moveBy(dX,dY);
},


//> @method drawOval.moveBy()
// Move the drawOval by the specified delta
// @param dX (int) number of pixels to move horizontally
// @param dY (int) number of pixels to move vertically
// @visibility drawing
//<
moveBy : function (dX, dY) {
    if (dX != null) this.centerPoint[0] += dX;
    if (dY != null) this.centerPoint[1] += dY;

    // synch up rect coords
    this._deriveRectFromRadius();
    if (this.drawingVML) {
        // POSITION and SIZE attributes from VML spec did not work
        var vmlHandleStyle = this._getVMLHandle().style;
        vmlHandleStyle.left = this.centerPoint[0] - this.rx;
        vmlHandleStyle.top = this.centerPoint[1] - this.ry;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "cx", this.centerPoint[0]);
        this._svgHandle.setAttributeNS(null, "cy", this.centerPoint[1]);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("moveBy", arguments);
},

//> @method drawOval.moveTo()
// Move the drawOval to the specified left/top position. You may also call
// +link{drawOval.setCenterPoint} to reposition the oval around a new center position.
// @param left (int) new left coordinate
// @param top (int) new top coordinate
// @visibility drawing
//<
moveTo : function (left,top) {
    this.moveBy(left - this.left, top - this.top);
},

//> @method drawOval.setLeft()
// Set the left coordinate of the drawOval
// @param left (int) new left coordinate
// @visibility drawing
//<
setLeft : function (left) {
    this.moveTo(left, this.top);
},

//> @method drawOval.setTop()
// Set the top coordinate of the drawOval
// @param top (int) new top coordinate
// @visibility drawing
//<
setTop : function (top) {
    this.moveTo(this.left, top);
},


//> @method drawOval.resizeBy()
// Resize by the specified delta. Note that the resize will occur from the current top/left
// coordinates, meaning the center positon of the oval may change. You may also use
// +link{drawOval.setRadii()} to change the radius in either direction without modifying the
// centerpoint.
// @param dX (int) number of pixels to resize by horizontally
// @param dY (int) number of pixels to resize by vertically
// @visibility drawing
//<
// @param fromCenter (boolean) internal parameter used by setRadii so we can have a single
//  codepath to handle resizing. If passed, resize from the center, not from the top left coordinate
resizeBy : function (dX, dY, fromCenter) {
    if (dX != null) this.width += dX;
    if (dY != null) this.height += dY;

    if (fromCenter) {
        if (dX != null) this.left -= Math.round(dX / 2);
        if (dY != null) this.top -= Math.round(dY / 2);
    }

    // Synch up the radius settings
    this._deriveCenterPointFromRect();

    if (this.drawingVML) {
        var vmlHandleStyle = this._getVMLHandle().style;
        vmlHandleStyle.width = this.width;
        vmlHandleStyle.height = this.height;
        if (fromCenter) {
            vmlHandleStyle.left = this.left;
            vmlHandleStyle.top = this.top;
        }
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "rx", this.rx);
        this._svgHandle.setAttributeNS(null, "ry", this.ry);
        if (!fromCenter) {
            this._svgHandle.setAttributeNS(null, "cx", this.centerPoint[0]);
            this._svgHandle.setAttributeNS(null, "cy", this.centerPoint[1]);
        }
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("resizeBy", arguments);
    if (fromCenter) this._moved(dX / 2, dY / 2);
},

//> @method drawOval.resizeTo()
// Resize to the specified size. Note that the resize will occur from the current top/left
// coordinates, meaning the center positon of the oval may change. You may also use
// +link{drawOval.setRadii()} to change the radius in either direction without modifying the
// centerpoint.
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
// @param fromCenter (boolean) keep the current center point
resizeTo : function (width,height, fromCenter) {
    var dX = 0, dY = 0;
    if (width != null) dX = width - this.width;
    if (height != null) dY = height - this.height;

    this.resizeBy(dX,dY, fromCenter);
},


//> @method drawOval.setWidth()
// Set the width of the drawOval
// @param width (int) new width
// @visibility drawing
//<
setWidth : function (width) {
    this.resizeTo(width);
},

//> @method drawOval.setHeight()
// Set the height of the drawOval
// @param height (int) new height
// @visibility drawing
//<
setHeight : function (height) {
    this.resizeTo(null, height);
},

//> @method drawOval.setRect()
// Move and resize the drawOval to match the specified coordinates and size.
// @param left (int) new left coordinate
// @param top (int) new top coordinate
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
setRect : function (left,top,width,height) {
    this.moveTo(left,top);
    this.resizeTo(width,height);
},

//> @method drawOval.getRadiusX()
// Returns the horizontal radius of the DrawOval.
// @return (int) the horizontal radius.
// @see DrawOval.setRadii()
// @visibility drawing
//<
getRadiusX : function () {
    return this.rx;
},

//> @method drawOval.getRadiusY()
// Returns the vertical radius of the DrawOval.
// @return (int) the vertical radius.
// @see DrawOval.setRadii()
// @visibility drawing
//<
getRadiusY : function () {
    return this.ry;
},

//> @method drawOval.setRadii()
// Resize the drawOval by setting its horizontal and vertical radius, and retaining its current
// center point.
// @param rx (int) new horizontal radius
// @param ry (int) new vertical radius
// @see DrawOval.getRadiusX()
// @see DrawOval.getRadiusY()
// @visibility drawing
//<
setRadii : function (rx, ry) {
    if (isc.isAn.Array(rx)) {
        ry = rx[1];
        rx = rx[0];
    }
    var width,height;
    if (rx != null) width = 2*rx;
    if (ry != null) height = 2*ry;
    // use resizeTo, with the additional coordinate to retain the current center point. This
    // will give us a consistent code-path for resizes
    this.resizeTo(width,height, true);
},

//> @method drawOval.setRadius()
// Resize the drawOval by setting its radius, and retaining its current center point.
// Equivalent to <code>setRadii(radius, radius)</code>.
// @param radius (int) new radius. This will be applied on both axes, meaning calling this
// method will always result in the DrawOval being a circle.
// @see DrawOval.setRadii()
// @visibility drawing
//<
setRadius : function (radius) {
    this.setRadii(radius,radius);
},

//> @method drawOval.setOval()
// Resize and reposition the drawOval by setting its radius, and centerPoint.
// @param cx (int) new horizontal center point coordinate
// @param cy (int) new vertical center point coordinate
// @param rx (int) new horizontal radius
// @param ry (int) new vertical radius
// @visibility drawing
//<
setOval : function (cx, cy, rx, ry) {
    this.setCenterPoint(cx,cy);
    this.setRadii(rx,ry);
},

//> @method drawOval.getCenter()
// Get the center of the oval.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    return this.centerPoint.duplicate();
}

}); // end DrawOval.addProperties

isc.DrawOval.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawSector
//
//  DrawItem subclass to render Pie Slices.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawSector", "DrawItem");

isc.DrawSector.addClassProperties({
    //> @classMethod drawSector.getArcMidpoint()
    // Calculates the midpoint coordinates of the circular arc of the sector defined by the
    // given centerPoint, startAngle, endAngle, and radius. The formula for this point is:
    // <blockquote>
    // <pre>var averageAngle = (startAngle + endAngle) / 2; // in degrees
    //[centerX + radius * cosdeg(averageAngle), centerY + radius * sindeg(averageAngle)]</pre>
    // </blockquote>
    // @param centerX (double) X coordinate of the center point of the sector.
    // @param centerY (double) Y coordinate of the center point of the sector.
    // @param startAngle (double) start angle of the sector in degrees.
    // @param endAngle (double) end angle of the sector in degrees.
    // @param radius (double) radius of the sector.
    // @return (Point) the coordinates of the midpoint of the arc.
    // @visibility drawing
    //<
    getArcMidpoint : function (centerX, centerY, startAngle, endAngle, radius) {
        var averageAngle = (startAngle + endAngle) / 2;
        return [centerX + radius * isc.Math.cosdeg(averageAngle),
                centerY + radius * isc.Math.sindeg(averageAngle)];
    }
});

isc.DrawSector.addProperties({
    //> @attr drawSector.knobs
    // DrawSector only supports the
    // <smartclient>"move"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
    // knob type.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    //> @attr drawSector.rotation
    // Rotation in degrees about the +link{DrawSector.centerPoint,centerPoint} of the DrawSector.
    // The positive direction is clockwise.
    // @include DrawItem.rotation
    //<

    //> @attr drawSector.centerPoint     (Point : [0,0] : IRW)
    // Center point of the sector
    // @visibility drawing
    //<
    centerPoint: [0,0],

    //> @attr drawSector.startAngle      (float: 0.0 : IR)
    // Start angle of the sector in degrees.  Default of 0.0 will create a sector that starts
    // with a line from the +link{centerPoint} and extends to the right for the indicated
    // +link{radius}, then sweeps clockwise toward the +link{endAngle}.
    // @visibility drawing
    //<
    startAngle: 0.0,

    //> @attr drawSector.endAngle      (float: 20.0 : IR)
    // End angle of the sector in degrees.
    // @visibility drawing
    //<
    endAngle: 20.0,

    //> @attr drawSector.radius         (int : 100: IR)
    // Radius of the sector.
    // @visibility drawing
    //<
    radius: 100,

    svgElementName: "path",
    vmlElementName: "SHAPE",

init : function () {
    this.Super("init");
    this.centerPoint = this.centerPoint.duplicate();
},

//> @method drawSector.getBoundingBox()
// Returns the centerPoint endPoint
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var convert = this._radPerDeg,
        centerPoint = this.centerPoint,
        radius = this.radius,
        startAngle = this.startAngle,
        endAngle = this.endAngle,
        diffAngle = (endAngle - startAngle),
        wholeCircle = (diffAngle >= 360 || (diffAngle != 0 && Math.round(diffAngle) % 360 == 0)),
        minSin = 0, maxSin = 0, minCos = 0, maxCos = 0;

    if (wholeCircle) {
        minSin = minCos = -1;
        maxSin = maxCos = 1;
    } else {
        if (!(0 <= startAngle && startAngle < 360)) {
            startAngle = (360 + (startAngle % 360)) % 360;
        }
        if (!(0 <= endAngle && endAngle < 360)) {
            endAngle = (360 + (endAngle % 360)) % 360;
        }

        var wrap = (startAngle > endAngle);
        if (wrap ? (startAngle < 270 || 270 < endAngle) : (startAngle < 270 && 270 < endAngle)) {
            minSin = -1;
        } else {
            minSin = Math.min(0, Math.sin(convert * startAngle), Math.sin(convert * endAngle));
        }
        if (wrap ? (startAngle < 90 || 90 < endAngle) : (startAngle < 90 && 90 < endAngle)) {
            maxSin = 1;
        } else {
            maxSin = Math.max(0, Math.sin(convert * startAngle), Math.sin(convert * endAngle));
        }
        if (wrap ? (startAngle < 180 || 180 < endAngle) : (startAngle < 180 && 180 < endAngle)) {
            minCos = -1;
        } else {
            minCos = Math.min(0, Math.cos(convert * startAngle), Math.cos(convert * endAngle));
        }
        if (wrap) {
            maxCos = 1;
        } else {
            maxCos = Math.max(0, Math.cos(convert * startAngle), Math.cos(convert * endAngle));
        }
    }

    var bbox = (outputBox || new Array(4));
    bbox[0] = centerPoint[0] + radius * minCos;
    bbox[1] = centerPoint[1] + radius * minSin;
    bbox[2] = centerPoint[0] + radius * maxCos;
    bbox[3] = centerPoint[1] + radius * maxSin;
    return includeStroke != true ? bbox : this._adjustBoundingBoxForStroke(bbox);
},

showResizeKnobs : null,
hideResizeKnobs : null,


_normalizeLinearGradient : function (def) {
    var center = this.centerPoint,
        radius = this.radius,
        boundingBox = [center[0], center[1], center[0] + radius, center[1] + radius];
    return isc.DrawItem._normalizeLinearGradient(def, boundingBox);
},
_normalizeRadialGradient : function (def) {
    var center = this.getCenter(),
        radius = this.radius,
        boundingBox = [center[0], center[1], center[0] + radius, center[1] + radius];
    return isc.DrawItem._normalizeRadialGradient(def, boundingBox, center);
},

//> @method drawSector.getCenter()
// Returns the sector's +link{DrawSector.centerPoint,centerPoint}.
// @return (Point) the current centerPoint
// @visibility drawing
//<
getCenter : function () {
    return this.centerPoint.duplicate();
},

//> @method drawSector.getArcMidpoint()
// Calculates the coordinates of the midpoint of this DrawSector's circular arc. The formula
// for this point is:
// <blockquote>
// <pre>var averageAngle = (startAngle + endAngle) / 2; // in degrees
//[centerX + radius * cosdeg(averageAngle), centerY + radius * sindeg(averageAngle)]</pre>
// </blockquote>
// @return (Point) the coordinates of the midpoint of the arc.
// @visibility external
//<
getArcMidpoint : function () {
    return isc.DrawSector.getArcMidpoint(this.centerPoint[0], this.centerPoint[1],
                                         this.startAngle,
                                         this.endAngle,
                                         this.radius);
},

getAttributesVML : function () {
    var info = this._getAttributesVML();
    return isc.SB.concat(
        "coordsize='",
        info.coordsizeX, " ", info.coordsizeY,
        "' style='position:absolute",
        ";left:", info.left,
        "px;top:", info.top,
        "px;width:", info.width,
        "px;height:", info.height,
        "px'",
        " path='", info.path, "'");
},

_attributesVML: { coordsizeX: 0, coordsizeY: 0, left: 0, top: 0, width: 0, height: 0, path: "" },
_getAttributesVML : function () {
    var centerPoint = this.centerPoint,
        bbox = this.getBoundingBox(false, this._tempBoundingBox),
        left = bbox[0],
        top = bbox[1],
        bboxWidth = bbox[2] - left,
        bboxHeight = bbox[3] - top;

    var cx = this.drawPane._toVMLCoord(centerPoint[0] - left),
        cy = this.drawPane._toVMLCoord(centerPoint[1] - top),
        r = this.drawPane._toVMLCoord(this.radius);

    var startAngle = this.startAngle,
        diffAngle = (this.endAngle - startAngle),
        wholeCircle = (diffAngle >= 360 || (diffAngle != 0 && Math.round(diffAngle) % 360 == 0));
    if (wholeCircle) {
        diffAngle = 360;
    } else {
        diffAngle = (360 + (diffAngle % 360)) % 360;
        if (diffAngle < 0) {
            startAngle = -startAngle;
            diffAngle = 360 - diffAngle;
        }
    }

    var info = this._attributesVML;
    info.coordsizeX = bboxWidth * this.drawPane._pow10;
    info.coordsizeY = bboxHeight * this.drawPane._pow10;
    info.left = left;
    info.top = top;
    info.width = bboxWidth;
    info.height = bboxHeight;
    info.path = isc.SB.concat(
        "m", cx, " ", cy,
        " ae", cx, " ", cy,
        " ", r, " ", r,
        // VML angles are "fixed numbers" (also called "fixed data" or "fd units") and positive
        // is counter-clockwise. To convert degrees to fixed numbers, we multiply by 2^16. We
        // then multiply by -1 to convert positive being clockwise to positive being counter-clockwise.
        " ", Math.floor(startAngle * -65536), " ", Math.ceil(diffAngle * -65536), " x");
    return info;
},

_updateVMLHandle : function () {

    var info = this._getAttributesVML(),
        vmlHandle = this._getVMLHandle(),
        vmlHandleStyle = vmlHandle.style;

    vmlHandle.coordsize.x = info.coordsizeX;
    vmlHandle.coordsize.y = info.coordsizeY;
    vmlHandleStyle.left = info.left + isc.px;
    vmlHandleStyle.top = info.top + isc.px;
    vmlHandleStyle.width = info.width + isc.px;
    vmlHandleStyle.height = info.height + isc.px;
    vmlHandle.path = info.path;
},

getAttributesSVG : function () {
    return "d='" + this.getPathSVG() + "'";
},

getPathSVG : function () {
    var startAngle = this.startAngle * this._radPerDeg,
        endAngle = this.endAngle * this._radPerDeg,
        diffAngle = (this.endAngle - this.startAngle),
        radius = this.radius,
        cx = this.centerPoint[0],
        cy = this.centerPoint[0],
        largeArcFlag = ((360 + (diffAngle % 360)) % 360 > 180 ? "1" : "0"),
        wholeCircle = (diffAngle >= 360 || (diffAngle != 0 && Math.round(diffAngle) % 360 == 0)),
        c = Math.cos(startAngle),
        s = Math.sin(startAngle),
        x0 = cx + radius * c,
        y0 = cy + radius * s;
    if (wholeCircle) {
        var x1 = cx - radius * c,
            y1 = cy - radius * s;
        return isc.SB.concat(
            "M", cx, " ", cy,
            " L", x0, " ", y0,
            " A", radius, " ", radius, " 0 ", largeArcFlag, " 1 ", x1, " ", y1,
            " A", radius, " ", radius, " 0 ", largeArcFlag, " 1 ", x0, " ", y0,
            " Z");
    } else {
        var x1 = cx + radius * Math.cos(endAngle),
            y1 = cy + radius * Math.sin(endAngle);
        return isc.SB.concat(
            "M", cx, " ", cy,
            " L", x0, " ", y0,
            " A", radius, " ", radius, " 0 ", largeArcFlag, " 1 ", x1, " ", y1,
            " Z");
    }
},

drawBitmapPath : function (context) {
    var startAngle = this.startAngle * this._radPerDeg,
        endAngle = this.endAngle * this._radPerDeg,
        radius = this.radius,
        x = this.centerPoint[0],
        y = this.centerPoint[1];
    this.bmMoveTo(x, y, context);
    this.bmArc(x, y, radius, startAngle, endAngle, context);
    context.closePath();
},

//> @method drawSector.setCenterPoint()
// Change the center point for this sector.
// @param left (int) X coordinate of the center point.
// @param top (int) Y coordinate of the center point.
// @visibility drawing
//<
setCenterPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    var dX = 0, dY = 0;
    if (left != null) dX = left - this.centerPoint[0];
    if (top != null) dY = top - this.centerPoint[1];
    this.moveBy(dX,dY);
},

//> @method drawSector.moveTo()
// Move the drawSector by the specified delta
// @param x (int) coordinate to move to horizontally
// @param y (int) coordinate to move to vertically
// @visibility drawing
//<
moveTo : function (x, y) {
    this.moveBy(x-this.centerPoint[0],y-this.centerPoint[1]);
},

//> @method drawSector.moveBy()
// Move the DrawSector by the specified amounts.
// @param x (int) number of pixels to move by horizontally
// @param y (int) number of pixels to move by vertically
// @visibility drawing
//<
moveBy : function (x, y) {
    this.centerPoint[0] += x;
    this.centerPoint[1] += y;

    if (this.drawingVML) {
        this._updateVMLHandle();
    } else if (this.drawingSVG) {

        this._svgHandle.setAttributeNS(null, "transform", "translate(" +  x  + "," + y + ")");
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this.Super("moveBy", arguments);
}

}); // end DrawSector.addProperties

isc.DrawSector.markUnsupportedMethods("$class does not support knobs.", ["showKnobs", "setMoveKnobOffset"]);
isc.DrawSector.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawLabel
//
//  DrawItem subclass to render a single-line text label.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawLabel", "DrawItem").addClassProperties({

    suppressArbitraryRotationWarning: false,
    _checkRotation : function (rotation) {
        if (!this.suppressArbitraryRotationWarning && rotation) {
            rotation = ((rotation % 360) + 360) % 360;
            if (rotation != 0 && rotation != 90) {
                this.logWarn("Arbitrary rotation is not supported in IE8 and earlier. Only rotation by 0 or 90 degrees is supported.");
                this.suppressArbitraryRotationWarning = true;
            }
        }
    }

});

isc.DrawLabel.addProperties({

//> @attr drawLabel.knobs
// DrawLabel only supports the
// <smartclient>"move"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
// knob type.
// @see DrawItem.knobs
// @include DrawItem.knobs
//<

//> @attr drawLabel.contents (String : null : IRW)
// This is the content that will exist as the label.
// @visibility drawing
//<

//> @attr drawLabel.left (int : 0 : IR)
// Sets the amount from the left of its positioning that the element should be placed.
// @visibility drawing
//<
left:0,

//> @attr drawLabel.top (int : 0 : IR)
// Sets the amount from the top of its positioning that the element should be placed.
// @visibility drawing
//<
top:0,
//> @attr drawLabel.alignment (String : "start" : IR)
// Sets the text alignment from the x position. Similar to html5 context.textAlign, eg "start", "center", "end"
// @visibility drawing
//<
alignment: 'start',

//> @attr drawLabel.fontFamily (String : "Tahoma" : IR)
// Font family name, similar to the CSS font-family attribute.
// @visibility drawing
//<
fontFamily:"Tahoma",

//> @attr drawLabel.fontSize (int : 18 : IRW)
// Font size in pixels, similar to the CSS font-size attribute.
// @visibility drawing
//<
fontSize:18,

//> @attr drawLabel.fontWeight (String : "bold" : IR)
// Font weight, similar to the CSS font-weight attribute, eg "normal", "bold".
// @visibility drawing
//<
fontWeight:"bold",

//> @attr drawLabel.fontStyle (String : "normal" : IR)
// Font style, similar to the CSS font-style attribute, eg "normal", "italic".
// @visibility drawing
//<
fontStyle:"normal",

//> @attr drawLabel.lineColor
// The text color of the label.
// @include DrawItem.lineColor
//<


//> @attr drawLabel.rotation
// Rotation in degrees about the +link{top,top} +link{left,left} corner.  The positive
// direction is clockwise.
// <p>
// <b>NOTE:</b> In Internet Explorer 8 and earlier, only rotation by 0 or 90 degrees is supported.
// @include DrawItem.rotation
//<


init : function () {
    this._setContentLines();
    this._setLineHeight();
    this.Super("init", arguments);
    if (this.suppressArbitraryRotationWarning != true) isc.DrawLabel._checkRotation(this.rotation);
},

setCursor : function (newCursor) {
    this.Super("setCursor", arguments);
    if (this._htmlText != null) {
        this._htmlText.setCursor(newCursor);
    }
},

setCanDrag : function (canDrag) {
    this.Super("setCanDrag", arguments);
    if (this._htmlText != null) {
        this._htmlText.setProperty("canDragReposition", canDrag);
    }
},

setDragRepositionCursor : function (dragRepositionCursor) {
    this.Super("setDragRepositionCursor", arguments);
    if (this._htmlText != null) {
        this._htmlText.setProperty("dragRepositionCursor", dragRepositionCursor);
    }
},


isPointInPath : isc.DrawItem.getInstanceProperty("isInBounds"),

showResizeKnobs : null,
hideResizeKnobs : null,

//----------------------------------------
//  DrawLabel renderers
//----------------------------------------

//synchTextMove:true,
_getElementVML : function (id, conversionContext) {

    if (this.synchTextMove) {
    // TEXTBOX implementation
        return isc.SB.concat(
            this.drawPane.startTagVML("RECT")," ID='", id,
            "' STYLE='position:absolute;left:", this.left,
            "px; top:", this.top,
            (this.alignment ? "px; text-align:" + (this.alignment == "start" ? "left" : "right"): "px"),
            ";'>",this.drawPane.startTagVML("TEXTBOX")," INSET='0px, 0px, 0px, 0px' STYLE='overflow:visible",

            //(this.rotation != 0 ? ";rotation:" + 90 : ""),
            "; font-family:", this.fontFamily,
            // NOTE: manual zoom
            "; font-size:", this.fontSize * this.drawPane.zoomLevel,
            "px; font-weight:", this.fontWeight,
            "; font-style:", this.fontStyle,
            ";'><NOBR style='color:", this.lineColor, "'>",
            this.contents == null ? null : String(this.contents).asHTML(),
            "</NOBR>",
            this.drawPane.endTagVML("TEXTBOX"),
            this.drawPane.endTagVML("RECT"));
    } else if (conversionContext == null) {
    // DIV implementation
        var screenCoords = this.drawPane.drawing2screen([this.left, this.top, 0, 0]),
            left = screenCoords[0],
            top = screenCoords[1],
            labelDims = this.drawPane.measureLabel(this.contents, this),
            rotation = (((this.rotation == null ? 0 : this.rotation) % 360) + 360) % 360,
            useWritingModeTbRl = rotation != 0;

        if (useWritingModeTbRl) {

            if (isc.Browser.isIE && isc.Browser.version >= 7 && isc.Browser.isStrict) {
                // the height as returned by measureLabel() will be the width of label when it's rotated
                if (rotation > 180) left += labelDims.height;
            } else {
                if (rotation <= 180) left -= labelDims.height;
            }
            if (rotation > 180) {
                top -= labelDims.width;
            }
        }

        return isc.SB.concat(
             "<DIV ID='", id,
            "' STYLE='position:absolute; overflow:visible; width:1px; height:1px",
            // the top-level VML container is relatively positioned hence 0,0 in drawing space
            // is inside the CSS padding of the draw pane.  This DIV is absolutely positioning
            // hence its 0,0 would be inside the border.
            "; left:", left, "px; top:", top, "px",

            (useWritingModeTbRl ? ";writing-mode: tb-rl" : ""),
            "; font-family:", this.fontFamily,
            "; font-size:", (this.fontSize * this.drawPane.zoomLevel),
            "px; font-weight:", this.fontWeight,
            "; font-style:", this.fontStyle,
            ";'><NOBR style='color:", this.lineColor, "'>", this.contents == null ? null : String(this.contents).asHTML(), "</NOBR></DIV>");
    } else {
        conversionContext.drawLabelsAccumulator.add(this);
        return isc.emptyString;
    }
},

_getVMLTextHandle : function () {
    var vmlTextHandle = this._vmlTextHandle;
    if (vmlTextHandle != null) return vmlTextHandle;
    var vmlHandle = this._getVMLHandle();
    if (vmlHandle == null) return null;
    if (this.synchTextMove) {
        vmlTextHandle = vmlHandle.firstChild.style; // VML TEXTBOX
    } else {
        vmlTextHandle = vmlHandle.style; // external DIV
    }
    return (this._vmlTextHandle = vmlTextHandle);
},

getSvgString : function (conversionContext) {
    conversionContext = conversionContext || isc.SVGStringConversionContext.create();
    var left = this.left, top = this.top, rotation = this.rotation, center,
        y = (conversionContext.printForExport !== false ? top + this.fontSize : top),
        svg = isc.SB.create();
    svg.append(
        "<text id='isc_DrawItem_", this.drawItemID,
        "' x='", left,
        "' y='", y,
        "' dominant-baseline='text-before-edge",
        "' font-family='", this.fontFamily, // TODO FFSVG15 - list of fonts does not work, so switch fontFamily for each OS
        "' font-size='", this.fontSize, "px",
        "' font-weight='", this.fontWeight,
        "' font-style='", this.fontStyle,
        "' fill='", this.lineColor);
    if (rotation && (center = this.getCenter()) && center.length === 2) {

        svg.append("' transform='rotate(", rotation, " ", left, " ", top, ")");
    }
    svg.append("'");
    var attributesSVG = this.getAttributesSVG();
    if (attributesSVG) svg.append(" ", attributesSVG);
    if (this.alignment == "start") {
        svg.append(" text-anchor='start'");
    } else if (this.alignment == "center") {
        svg.append(" text-anchor='middle'");
    } else if (this.alignment == "end") {
        svg.append(" text-anchor='end'");
    }
    if (this.contents != null) {
        svg.append(">");
        var contents = String(this.contents);
        if (this._contentLines != null) {
            // Handle multiple lines of text using SVG's <tspan/> elements.
            var lineHeight = this._lineHeight;
            for (var i = 0, j = 1, len = this._contentLines.length; i < len; ++i) {
                var line = this._contentLines[i];
                if (line == "") {
                    // Increment the count of consecutive newlines.
                    ++j;
                } else {
                    svg.append(
                        "<tspan x='", left, "' dy='", lineHeight * j, "'>",
                        isc.makeXMLSafe(line),
                        "</tspan>");
                    j = 1;
                }
            }
        } else {
            svg.append(isc.makeXMLSafe(contents));
        }
        svg.append("</text>");
    } else svg.append("/>");
    return svg.toString();
},

//> @method drawLabel.moveBy()
// Change the label's +link{left,left} and +link{top,top} by the specified amounts.
// @param dX (int) number of pixels to move horizontally
// @param dY (int) number of pixels to move vertically
// @visibility drawing
//<
moveBy : function (dX, dY) {
    this.top += dY;
    this.left += dX;

    if (this.drawingVML) {
        var vmlHandleStyle = this._getVMLHandle().style;
        if (this.synchTextMove) {
            vmlHandleStyle.left = this.left;
            vmlHandleStyle.top = this.top;
        } else {
            vmlHandleStyle.left = this.left + isc.px;
            vmlHandleStyle.top = this.top + isc.px;
        }
    } else if (this.drawingSVG) {
        if (this._svgHandle) {
            this._svgHandle.setAttributeNS(null, "x", this.left);
            this._svgHandle.setAttributeNS(null, "y", this.top);
        }
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            // The "live update" to the htmlText component requires a newly computed local transform.
            delete this._transform;

            if (this._htmlText != null) {
                isc.Element._updateTransformStyle(this._htmlText, this._htmlText._getTransformFunctions());
            }
        } else {
            this.drawPane.redrawBitmap();
        }
    }
    this.Super("moveBy", arguments);
},

//> @method drawLabel.moveTo()
// Move the label to the absolute x, y coordinates
//
// @param left (int) new startLeft coordinate in pixels
// @param top (int) new startTop coordinate in pixels
// @visibility drawing
//<
moveTo : function (left, top) {
    this.moveBy(left - this.left, top - this.top);
},

rotateBy : function (degrees) {
    isc.DrawLabel._checkRotation(+this.rotation + degrees);
    this.Super("rotateBy", arguments);
},

//> @method drawLabel.getCenter()
// Get the center point of the label.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    var textWidth, textHeight;
    if (this.drawingSVG && !this._svgHandle) {
        var dims = this.drawPane.measureLabel(this.contents, this);
        textWidth = dims.width;
        textHeight = dims.height;
    } else {
        textWidth = this.getTextWidth();
        textHeight = this.getTextHeight();
    }
    return [this.left + Math.round(textWidth / 2), this.top + Math.round(textHeight / 2)];
},

//> @method drawLabel.getBoundingBox()
// Returns the top, left, top + textHeight, left + textWidth
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var textWidth, textHeight;
    if (this.drawingSVG && !this._svgHandle) {
        var dims = this.drawPane.measureLabel(this.contents, this);
        textWidth = dims.width;
        textHeight = dims.height;
    } else {
        textWidth = this.getTextWidth();
        textHeight = this.getTextHeight();
    }
    var box = (outputBox || new Array(4));
    box[0] = this.left;
    box[1] = this.top;
    box[2] = this.left + textWidth;
    box[3] = this.top + textHeight;
    return box;
},

_getHtmlTextContents : function () {
    return isc.SB.concat("<span style='font-family:", this.fontFamily,
                                     ";font-weight:", this.fontWeight,
                                     ";font-size:", this.fontSize,
                                     "px;font-style:", this.fontStyle,
                                     ";white-space:nowrap'>",
                              this.contents == null ? null : String(this.contents).asHTML(),
                         "</span>");
},

makeHTMLText : function () {
    var label = this._htmlText = isc.HTMLFlow.create({
        creator: this,
        left: 0, top: 0,
        width:1, height:1,
        cursor: this.cursor,
        canDragReposition: this.canDrag,
        dragAppearance: "target",
        dragRepositionCursor: this.dragRepositionCursor,
        contents: this._getHtmlTextContents(),
        canSelectText: false,
        textColor: this.lineColor,
        autoDraw: false,
        _getTransformFunctions : function () {
            var creator = this.creator,
                drawPane = creator.drawPane;


            var transformFunctions = " translate(" + creator.left + "px, " + creator.top + "px)";


            var t = creator._getLocalTransform();
            var precision = (drawPane == null ? 3 : drawPane.precision);
            transformFunctions = " matrix(" + t.m00.toFixed(precision) + ", " + t.m10.toFixed(precision) + ", " + t.m01.toFixed(precision) + ", " + t.m11.toFixed(precision) + ", " + t.m02.toFixed(precision) + ", " + t.m12.toFixed(precision) + ")" + transformFunctions;

            t = drawPane._getGlobalTransform();
            transformFunctions = " matrix(" + t.m00.toFixed(precision) + ", " + t.m10.toFixed(precision) + ", " + t.m01.toFixed(precision) + ", " + t.m11.toFixed(precision) + ", " + t.m02.toFixed(precision) + ", " + t.m12.toFixed(precision) + ")" + transformFunctions;

            transformFunctions = "translate(" + drawPane.getLeftPadding() + "px, " + drawPane.getTopPadding() + "px)" + transformFunctions;

            return transformFunctions;
        },
        getTransformCSS : function () {
            var transformFunctions = this._getTransformFunctions();
            return (
                ";" +
                isc.Element._transformCSSName + ":" + transformFunctions + ";" +
                isc.Element._transformOriginCSSName + ":0 0;"
            );
        },
        dragRepositionStop : function () {
            var creator = this.creator,
                drawPane = creator.drawPane;



            // At the end of a drag, this HTMLFlow's left and top have been changed as part of the
            // effect of dragAppearance:"target". For example, if the HTMLFlow is dragged 5px
            // down and 10px to the left, then getLeft() will be -10 and getTop() will be 5.
            // What we want to do is convert this translation in screen coordinates to a transform
            // in drawing coordinates (to update the position of the DrawLabel):
            //
            //     T|left,top * G = G * T|X
            //
            // .. where `G' is the global transform matrix, `T|left,top' is the translation matrix
            // by getLeft()/getTop(), and `T|X' is the transformation matrix that we want to solve for.
            // We have:
            //
            //     T|X = G^-1 * T|left,top * G
            //
            // In mathematical terms, `T|X' and `T|left,top' are similar matrices.
            // http://mathworld.wolfram.com/SimilarityTransformation.html
            //
            // Similar matrices represent the same linear transformation after a change of basis.
            // http://planetmath.org/similarmatrix
            // Thus, `T|X' is a translation matrix.

            // Since `T|X' is a translation matrix, we just move the DrawLabel by m02, m12.
            var t = (drawPane._getGlobalTransform()).getInverse()
                                                    .translate(this.getLeft(), this.getTop())
                                                    .rightMultiply(drawPane._getGlobalTransform());
            creator.moveBy(t.m02, t.m12);

            // Reset our left, top back to 0, 0.
            this.moveTo(0, 0);
        }
    });
    this.drawPane.addChild(label);
},

_useHTML : function () {
    return this.drawingBitmap && (this.useHTML != null ? this.useHTML : isc.Browser.isIPhone);
},

drawBitmap : function (context) {

    if (this._useHTML()) {
        // option to render as HTML.  Needed for some older browsers or on mobile devices so
        // that the text is not blurry.
        if (this._htmlText == null) {
            this.makeHTMLText();

        // update the htmlText transform
        } else {
            isc.Element._updateTransformStyle(this._htmlText, this._htmlText._getTransformFunctions());
        }
    } else {
        this.Super("drawBitmap", arguments);
    }
},

erase : function () {
    if (this._htmlText != null) this._htmlText.destroy();
    this.Super("erase", arguments);
},

destroy : function () {
    if (this._htmlText != null) this._htmlText.destroy();
    this.Super("destroy", arguments);
},

getFontString : function () {
    return (this.fontStyle != "normal" ? this.fontStyle + " " : "") +
                     (this.fontWeight != "normal" ? this.fontWeight + " " : "") +
                     this.fontSize + "px " + this.fontFamily;
},


_calculateAlignMiddleCorrection : function () {
    if (!(isc.Browser.isFirefox && isc.Browser.hasCANVAS && this._verticalAlignMiddle)) {
        return 0;
    } else {
        var cache = this.drawPane._alignMiddleCorrectionCache;
        if (cache == null) {
            cache = this.drawPane._alignMiddleCorrectionCache = {};
        }

        var font = this.getFontString();
        if (cache.hasOwnProperty(font)) {
            return cache[font];
        }

        var measureCanvas = isc.DrawPane._getMeasureCanvas();
        measureCanvas.setContents("<CANVAS></CANVAS>");
        measureCanvas.redraw();
        var canvas = measureCanvas.getHandle().getElementsByTagName("canvas")[0];
        var context = canvas.getContext("2d");

        context.font = font;
        var text = "The quick, brown fox",
            textMeasure = context.measureText(text),
            textWidth = textMeasure.width,
            textHeight = textMeasure.height || this.fontSize;

        var canvasWidth = context.canvas.width = Math.round(textWidth);
        var canvasHeight = context.canvas.height = Math.round(3 * textHeight);

        // Get the bottom of the text when textBaseline is "middle"
        context.textBaseline = "middle";
        context.font = font;
        context.fillText(text, textHeight, 0);
        var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight),
            data = imageData.data;
        var middleBottom = 0;
        for (var i = data.length - 4; i > 0; i -= 4) {
            if (data[i + 3]) {
                middleBottom = Math.floor(i / (4 * canvasWidth)) - textHeight;
                break;
            }
        }

        // Get the top and bottom of the text when textBaseline is "hanging"
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.textBaseline = "hanging";
        context.font = font;
        context.fillText(text, textHeight, 0);
        imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        data = imageData.data;
        var hangingBottom = 0;
        for (var i = data.length - 4; i > 0; i -=4) {
            if (data[i + 3]) {
                hangingBottom = Math.floor(i / (4 * canvasWidth)) - textHeight;
                break;
            }
        };
        var top = 0;
        for (var i = 0, dataLength = data.length; i < dataLength; i += 4) {
            if (data[i + 3]) {
                top = Math.floor(i / (4 * canvasWidth)) - textHeight;
            }
        }
        var actualTextHeight = hangingBottom - top;

        return (cache[font] = -Math.round((actualTextHeight - (hangingBottom - middleBottom)) / 2));
    }
},


drawBitmapPath : function (context) {


    context.textBaseline = "top";

    //this.logWarn("fontString: " + fontString);
    context.font = this.getFontString();

    context.fillStyle = this.lineColor;
    context.textAlign = this.alignment;
    var top0 = this.top + this._calculateAlignMiddleCorrection();
    if (this._contentLines == null) {
        this.bmFillText(this.contents, this.left, top0, context);
    } else {
        var lineHeight = this._lineHeight;
        for (var i = this._contentLines.length; i--; ) {
            this.bmFillText(this._contentLines[i], this.left, top0 + i * lineHeight, context);
        }
    }
},

_setLineHeight : function () {
    if (!this.drawingVML &&
        (this.drawingBitmap || this.drawingSVG ||
            (this.drawPane && (
                this.drawPane.drawingType == "bitmap" ||
                this.drawPane.drawingType == "svg"))) &&
        !this._useHTML())
    {
        this._lineHeight = (
            this.drawPane.measureLabel("Xy\nXy", this).height -
            this.drawPane.measureLabel("Xy", this).height);
    }
},

//----------------------------------------
//  DrawLabel attribute setters
//----------------------------------------

//> @method drawLabel.setLineColor()
// Sets the text color of the label.
// @param color (CSSColor) new text color.
// @include DrawItem.setLineColor()
//<
setLineColor : function (color) {
    this.lineColor = color;
    if (this.drawingVML) {
        var nobrElement = this._getVMLHandle().firstChild;
        while (nobrElement != null && nobrElement.tagName != this._$NOBR) {
            nobrElement = nobrElement.firstChild;
        }

        if (nobrElement != null) nobrElement.style.color = color;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "fill", color);
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            if (this._htmlText != null) {
                this._htmlText.setTextColor(color);
            }
        } else {
            this.drawPane.redrawBitmap();
        }
    }
},

//> @method drawLabel.setContents()
// Sets this DrawLabel's +link{contents,contents}.
// @param contents (String) the new contents.
// @visibility drawing
//<
_$NOBR: "NOBR",
setContents : function (contents) {
    this.contents = contents;
    this._setContentLines();
    if (this.drawingVML) {
        var nobrElement = this._getVMLHandle().firstChild;
        while (nobrElement != null && nobrElement.tagName != this._$NOBR) {
            nobrElement = nobrElement.firstChild;
        }

        if (nobrElement != null) nobrElement.innerText = contents;
    } else if (this.drawingSVG) {
        this._svgHandle.textContent = contents;
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            if (this._htmlText != null) {
                this._htmlText.setContents(this._getHtmlTextContents());
            }
        } else {
            this.drawPane.redrawBitmap();
        }
    }

    this._reshaped();
},

_newlineRegexp: /\r\n|\r|\n/g,
_setContentLines : function () {
    delete this._contentLines;
    var contents = this.contents;
    if (!isc.isA.String(contents)) {
        return;
    }


    if (!this.drawingVML &&
        (this.drawingBitmap || this.drawingSVG ||
            (this.drawPane && (
                this.drawPane.drawingType == "bitmap" ||
                this.drawPane.drawingType == "svg"))) &&
        !this._useHTML() &&
        contents.search(this._newlineRegexp) != -1)
    {
        this._contentLines = contents.split(this._newlineRegexp);
    }
},

getTextWidth : function () {
    if (!(this.drawingVML || this.drawingSVG || this.drawingBitmap)) {
        this.drawHandle();
    }

    if (this.drawingVML) {
        var vmlHandle = this._getVMLHandle();
        if (this.synchTextMove) {
            return vmlHandle.firstChild.scrollWidth; // VML TEXTBOX
        } else {
            return vmlHandle.scrollWidth; // external DIV
        }
    } else if (this.drawingSVG) {
        // could use getBBox().width - getBBox also gets the height - but guessing this is faster
        if (this._svgHandle) return this._svgHandle.getComputedTextLength();
        else this.drawPane.measureLabel(this.contents, this).width;
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            if (this._htmlText == null) this.makeHTMLText();
            return this._htmlText.getScrollWidth();
        } else {
            var context = this.drawPane.getBitmapContext(),
                contextFont = context.font,
                font = this.getFontString() || contextFont,
                saved = (font != contextFont);
            if (saved) {
                context.save();
                context.font = font;
            }
            var textWidth = context.measureText(this.contents).width;
            if (saved) {
                context.restore();
            }
            return textWidth;
        }
    }
},
getTextHeight : function () {
    if (!(this.drawingVML || this.drawingSVG || this.drawingBitmap)) {
        this.drawHandle();
    }

    if (this.drawingVML) {
        var vmlHandle = this._getVMLHandle();
        if (this.synchTextMove) {
            return vmlHandle.firstChild.scrollHeight; // VML TEXTBOX
        } else {
            return vmlHandle.scrollHeight; // external DIV
        }
    } else if (this.drawingSVG) {
        if (this._svgHandle) return this._svgHandle.getBBox().height;
        else this.drawPane.measureLabel(this.contents, this).height;
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            if (this._htmlText == null) this.makeHTMLText();
            return this._htmlText.getScrollHeight();
        } else {
            var context = this.drawPane.getBitmapContext(),
                contextFont = context.font,
                font = this.getFontString() || contextFont,
                saved = (font != contextFont);
            if (saved) {
                context.save();
                context.font = font;
            }
            var textHeight = context.measureText(this.contents).height || this.fontSize;
            if (saved) {
                context.restore();
            }
            return textHeight;
        }
    }
},

//> @method drawLabel.setFontSize()
// Sets this DrawLabel's +link{fontSize,fontSize}.
// @param size (int) the new font size in pixels.
// @visibility drawing
//<
setFontSize: function (size) {
    if (size != null) {
        this.fontSize = size;
        this._setLineHeight();
    }
    if (this.drawingVML) {
        this._getVMLTextHandle().fontSize = (size * this.drawPane.zoomLevel) + "px";
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "font-size", size + "px");
    } else if (this.drawingBitmap) {
        if (this._useHTML()) {
            if (this._htmlText != null) {
                this._htmlText.setContents(this._getHtmlTextContents());
            }
        } else {
            this.drawPane.redrawBitmap();
        }
    }

    this._reshaped();
},

_setLineWidthVML : isc.Class.NO_OP

}); // end DrawLabel.addProperties

// Mark the DrawItem line and fill attribute setters as unsupported. Same reason as with DrawGroup:
// If someone blindly called the superclass setters, they would error on DrawLabels because e.g.
// there are no VML stroke and fill subelements.
// TODO expand this list as additional setters are added to DrawItem
isc.DrawLabel.markUnsupportedMethods(null, ["setLineWidth", "setLineOpacity",
        "setLinePattern", "setLineCap", "setFillColor", "setFillGradient", "setFillOpacity"]);
isc.DrawLabel.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawImage
//
//  DrawItem subclass to render embedded images.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawImage", "DrawItem").addProperties({
    //> @attr drawImage.left (int : 0 : IRW)
    // @include drawRect.left
    //<
    left:0,

    //> @attr drawImage.top (int : 0 : IRW)
    // @include drawRect.top
    //<
    top:0,

    //> @attr drawImage.width    (int : 16 : IR)
    // @include drawRect.width
    //<
    width:16,

    //> @attr drawImage.height   (int : 16 : IR)
    // @include drawRect.height
    //<
    height:16,

    //> @attr drawImage.title  (String : null : IR)
    // Title (tooltip hover text) for this image.
    // @visibility drawing
    //<
    //title:"Untitled Image",

    //> @attr drawImage.src    (URL : "blank.png" : IRW)
    // URL to the image file.
    // @visibility drawing
    //<
    src:"blank.png",

//> @method drawImage.getBoundingBox()
// Returns the top, left, top+width, left+height
//
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var box = (outputBox || new Array(4));
    box[0] = this.left;
    box[1] = this.top;
    box[2] = this.left + this.width;
    box[3] = this.top + this.height;
    return box;
},

isPointInPath : isc.DrawItem.getInstanceProperty("isInBounds"),

// TODO copy w/h to internal properties so we can apply scaling without changing
//  the user properties
init : function () {
    this.Super("init");
    this.initImage(this.src);
},

initImage : function (src) {
    if (src) {
        // Support relative image-paths.
        src = this.getSrcURL(src);

        // Create the Image object if not already created.
        var image = this.image;
        if (image == null) {
            image = this.image = new Image();

            var self = this;
            image.onload = function () {
                if (self.drawingBitmap) {
                    self.drawPane.redrawBitmap();
                }
            };
        }

        // Set the image's src to load the image.
        image.src = src;
    }
},

//----------------------------------------
//  DrawImage renderers
//----------------------------------------

getSrcURL : function (src) {
    var result = isc.Canvas.getImgURL(src);
    return result;
},

_getElementVML : function (id) {
    var result = isc.SB.concat(
        this.drawPane.startTagVML('IMAGE')," ID='", id,
            "' SRC='", this.getSrcURL(this.src),
            (this.title ? "' ALT='"+this.title : ""),
            "' STYLE='left:", this.left,
            "px; top:", this.top,
            "px; width:", this.width,
            "px; height:", this.height,
            "px;'>",this.drawPane.endTagVML("IMAGE")
    );

    return result;
},

getSvgString : function (conversionContext) {
    var center;
    var svgString = "<image id='isc_DrawItem_" + this.drawItemID;
    if (this.rotation && (center = this.getCenter()) && center.length === 2) {
        svgString += "' transform='rotate(" + this.rotation + " " + center[0]  + " " + center[1] + ")"
    }
    svgString += "' x='" + this.left +
        "' y='" + this.top +
        "' width='" + this.width +
        "px' height='" + this.height +
        "px' " + (conversionContext ? conversionContext.xlinkPrefix||isc.SVGStringConversionContext._$xlink : isc.SVGStringConversionContext._$xlink) + ":href='" + this.getSrcURL(this.src) + "'";
    var attributesSVG = this.getAttributesSVG();
    if (attributesSVG) svgString += " " + attributesSVG;
    if (this.title) {
        svgString += "><title>" + isc.makeXMLSafe(this.title) + "</title></image>";
    } else svgString += "/>";
    return svgString;
},

drawBitmapPath : function(context) {
    context.drawImage(this.image,this.left,this.top,this.width,this.height);
},

//> @method drawImage.getCenter()
// Get the center point of the image.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    return [this.left + Math.round(this.width/2), this.top + Math.round(this.height/2)];
},

//----------------------------------------
//  DrawImage attribute setters
//----------------------------------------

//> @method drawImage.setSrc()
// Change the URL of the image displayed.
// @param src (URL) new URL
//
// @visibility drawing
//<
setSrc: function (src) {
    this.initImage(src);

    if (this.drawingVML) {
        this._getVMLHandle().src = this.src;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(isc._$xlinkNS, "href", this.src);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

_setLineWidthVML : isc.Class.NO_OP,

//> @method drawImage.moveBy()
// Move the drawImage by the specified delta
// @param dX (int) number of pixels to move horizontally
// @param dY (int) number of pixels to move vertically
// @visibility drawing
//<
moveBy : function (dX, dY) {
    this.left += dX;
    this.top += dY;

    if (this.drawingVML) {
        var vmlHandleStyle = this._getVMLHandle().style;
        vmlHandleStyle.left = this.left;
        vmlHandleStyle.top = this.top;
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "x", this.left);
        this._svgHandle.setAttributeNS(null, "y", this.top);
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("moveBy", arguments);
},

//> @method drawImage.moveTo()
// Move the drawImage to the specified position
// @param left (int) new left coordinate
// @param top (int) new top coordinate
// @visibility drawing
//<
moveTo : function (left,top) {
    this.moveBy(left - this.left, top - this.top);
},

resizeBy : isc.DrawRect.getInstanceProperty("resizeBy"),

resizeTo : isc.DrawRect.getInstanceProperty("resizeTo")

}); // end DrawImage.addProperties

isc.DrawImage.markUnsupportedMethods(null, ["setLineWidth", "setLineColor", "setLineOpacity",
        "setLinePattern", "setLineCap", "setFillColor", "setFillGradient", "setFillOpacity"]);
isc.DrawImage.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawCurve
//
//  DrawItem that renders cubic bezier curves.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

// TODO consider whether this should be a subclass of DrawPath instead
isc.defineClass("DrawCurve", "DrawItem").addProperties({
    //> @attr drawCurve.knobs
    // Array of control knobs to display for this item. Each +link{knobType} specified in this
    // will turn on UI element(s) allowing the user to manipulate this DrawCurve.  To update the
    // set of knobs at runtime use +link{drawItem.showKnobs()} and +link{drawItem.hideKnobs()}.
    // <p>
    // DrawCurve supports the
    // <smartclient>"startPoint", "endPoint", "controlPoint1", and "controlPoint2"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#STARTPOINT}, {@link com.smartgwt.client.types.KnobType#ENDPOINT},
    // {@link com.smartgwt.client.types.KnobType#CONTROLPOINT1}, and {@link com.smartgwt.client.types.KnobType#CONTROLPOINT2}</smartgwt>
    // knob types.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    //> @attr drawCurve.startPoint     (Point : [0,0] : IRW)
    // Start point of the curve
    // @visibility drawing
    //<
    startPoint: [0,0],

    //> @attr drawCurve.endPoint       (Point : [100,100] : IRW)
    // End point of the curve
    // @visibility drawing
    //<
    endPoint: [100,100],

    //> @attr drawCurve.controlPoint1  (Point : [100,0] : IRW)
    // First cubic bezier control point.
    // @visibility drawing
    //<
    controlPoint1: [100,0],

    //> @attr drawCurve.controlPoint2  (Point : [0,100] : IRW)
    // Second cubic bezier control point.
    // @visibility drawing
    //<
    controlPoint2: [0,100],

    svgElementName: "path",
    vmlElementName: "curve",

    //> @attr drawCurve.lineCap     (LineCap : "butt" : IRW)
    // Style of drawing the endpoints of a line.
    // <P>
    // Note that for dashed and dotted lines, the lineCap style affects each dash or dot.
    //
    // @group line
    // @visibility drawing
    //<
    lineCap: "butt",

init : function () {
    this.Super("init");
    this.startPoint = this.startPoint.duplicate();
    this.endPoint = this.endPoint.duplicate();
    this.controlPoint1 = this.controlPoint1.duplicate();
    this.controlPoint2 = this.controlPoint2.duplicate();
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }
},

_getKnobPosition : function (position) {
    var x,y;
    x = this.endPoint[0] - this.startPoint[0];
    y = this.endPoint[1] - this.startPoint[1];
    return [x,y];
},

//> @method drawCurve.getCenter()
// Get the center point of the rectangle from the curve's +link{DrawCurve.startPoint,startPoint}
// to the +link{DrawCurve.endPoint,endPoint}.
// @return (Point) the center point
// @visibility drawing
//<
getCenter : function () {
    return [this.startPoint[0] + Math.round((this.endPoint[0] - this.startPoint[0])/2), this.startPoint[1] + Math.round((this.endPoint[1] - this.startPoint[1])/2)];
},



//----------------------------------------
//  DrawCurve renderers
//----------------------------------------

getAttributesVML : function () {
    return isc.SB.concat(
            "FROM='", this.startPoint[0], " ", this.startPoint[1],
            "' TO='", this.endPoint[0], " ", this.endPoint[1],
            "' CONTROL1='", this.controlPoint1[0], " ", this.controlPoint1[1],
            "' CONTROL2='", this.controlPoint2[0], " ", this.controlPoint2[1],
            "'");
},

getAttributesSVG : function () {
    return  "d='" + this.getPathSVG() + "'"
},

getPathSVG : function () {
    return  "M" + this.startPoint[0] + " " + this.startPoint[1] +
            "C" + this.controlPoint1[0] + " " + this.controlPoint1[1] +
            " " + this.controlPoint2[0] + " " + this.controlPoint2[1] +
            " " + this.endPoint[0] + " " + this.endPoint[1]
},

computeBezierPoint : function (t) {
    var x = isc.DrawPane.bezier(
        this.startPoint[0], this.controlPoint1[0], this.controlPoint2[0], this.endPoint[0], t);
    var y = isc.DrawPane.bezier(
        this.startPoint[1], this.controlPoint1[1], this.controlPoint2[1], this.endPoint[1], t);
    return [x, y];
},

drawBitmapPath : function (context, drawFlag) {
    var hasArrow = false;
    if (this.startArrow == "open" || this.startArrow == "block") {
        hasArrow = true;
        context.save();
        this._drawBitmapStartArrow(context, this.lineWidth, (drawFlag !== false));
        context.restore();
    }
    if (this.endArrow == "open" || this.endArrow == "block") {
        hasArrow = true;
        context.save();
        this._drawBitmapEndArrow(context, this.lineWidth, (drawFlag !== false));
        context.restore();
    }
    if (hasArrow) {
        // Clear out the current path, which now contains the start or end arrow, so that the
        // arrow is not stroked and/or filled twice.
        context.beginPath();
    }
    context.moveTo(
        this.startPoint[0], this.startPoint[1]
    );
    context.bezierCurveTo(
        this.controlPoint1[0], this.controlPoint1[1],
        this.controlPoint2[0], this.controlPoint2[1],
        this.endPoint[0], this.endPoint[1]
    );
},

_drawBitmapStartArrow : function (context, lineWidth, draw) {

    var arrowDelta = 10,
        originX = this.startPoint[0],
        originY = this.startPoint[1],
        point = this.computeBezierPoint(0.01),
        angle = this.computeAngle(originX, originY, point[0], point[1]);

    context.beginPath();
    if (draw) {
        context.fillStyle = this.lineColor;
        context.strokeStyle = this.lineColor;
    }
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.translate(originX, originY);
    context.rotate(angle * this._radPerDeg);
    this.bmMoveTo(arrowDelta, -arrowDelta, context);
    this.bmLineTo(0, 0, context);
    this.bmLineTo(arrowDelta, arrowDelta, context);
    if (this.startArrow == "block") {
        context.closePath();
    }
    if (draw) {
        if (this.startArrow == "block") {
            context.fill();
        }
        context.stroke();
    }
},

_drawBitmapEndArrow : function (context, lineWidth, draw) {

    var arrowDelta = 10,
        originX = this.endPoint[0],
        originY = this.endPoint[1],
        point = this.computeBezierPoint(0.99),
        angle = this.computeAngle(point[0], point[1], originX, originY);

    context.beginPath();
    if (draw) {
        context.fillStyle = this.lineColor;
        context.strokeStyle = this.lineColor;
    }
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.translate(originX, originY);
    context.rotate(angle * this._radPerDeg);
    this.bmMoveTo(-arrowDelta, arrowDelta, context);
    this.bmLineTo(0, 0, context);
    this.bmLineTo(-arrowDelta, -arrowDelta, context);
    if (this.endArrow == "block") {
        context.closePath();
    }
    if (draw) {
        if (this.endArrow == "block") {
            context.fill();
        }
        context.stroke();
    }
},


_bezierCurve : function (p1x, p1y, cp1x, cp1y, cp2x, cp2y, p2x, p2y) {
    this.p1x = p1x;
    this.p1y = p1y;
    this.cp1x = cp1x;
    this.cp1y = cp1y;
    this.cp2x = cp2x;
    this.cp2y = cp2y;
    this.p2x = p2x;
    this.p2y = p2y;
},

_bezierCurveZero : function () {
    return new this._bezierCurve(0, 0, 0, 0, 0, 0, 0, 0);
},

_bezierCurveCopy : function (curve, output) {
    output.p1x = curve.p1x;
    output.p1y = curve.p1y;
    output.cp1x = curve.cp1x;
    output.cp1y = curve.cp1y;
    output.cp2x = curve.cp2x;
    output.cp2y = curve.cp2y;
    output.p2x = curve.p2x;
    output.p2y = curve.p2y;
    return output;
},

_drawCurveToBezierCurve : function (drawCurve) {
    return new this._bezierCurve(
        drawCurve.startPoint[0], drawCurve.startPoint[1],
        drawCurve.controlPoint1[0], drawCurve.controlPoint1[1],
        drawCurve.controlPoint2[0], drawCurve.controlPoint2[1],
        drawCurve.endPoint[0], drawCurve.endPoint[1]);
},

_bezierCurveReverse : function (curve, output) {
    var swap = curve.p1x;
    output.p1x = curve.p2x;
    output.p2x = swap;
    swap = curve.p1y;
    output.p1y = curve.p2y;
    output.p2y = swap;
    swap = curve.cp1x;
    output.cp1x = curve.cp2x;
    output.cp2x = swap;
    swap = curve.cp1y;
    output.cp1y = curve.cp2y;
    output.cp2y = swap;
    return output;
},


_bezierCurveDeCasteljau : function (curve, t, leftOutputCurve, rightOutputCurve) {

    var w = 1 - t,
        p1x = curve.p1x,
        p1y = curve.p1y,
        p2x = curve.p2x,
        p2y = curve.p2y,
        ax = w * p1x + t * curve.cp1x,
        ay = w * p1y + t * curve.cp1y,
        bx = w * curve.cp1x + t * curve.cp2x,
        by = w * curve.cp1y + t * curve.cp2y,
        cx = w * curve.cp2x + t * p2x,
        cy = w * curve.cp2y + t * p2y,
        dx = w * ax + t * bx,
        dy = w * ay + t * by,
        ex = w * bx + t * cx,
        ey = w * by + t * cy,
        fx = w * dx + t * ex,
        fy = w * dy + t * ey;

    if (leftOutputCurve != null) {
        leftOutputCurve.p1x = p1x;
        leftOutputCurve.p1y = p1y;
        leftOutputCurve.cp1x = ax;
        leftOutputCurve.cp1y = ay;
        leftOutputCurve.cp2x = dx;
        leftOutputCurve.cp2y = dy;
        leftOutputCurve.p2x = fx;
        leftOutputCurve.p2y = fy;
    }

    if (rightOutputCurve != null) {
        rightOutputCurve.p1x = fx;
        rightOutputCurve.p1y = fy;
        rightOutputCurve.cp1x = ex;
        rightOutputCurve.cp1y = ey;
        rightOutputCurve.cp2x = cx;
        rightOutputCurve.cp2y = cy;
        rightOutputCurve.p2x = p2x;
        rightOutputCurve.p2y = p2y;
    }
},


_calculateOffsetCurvePath : function () {

    var epsilon = 1e-6,

        flatness = 0.01,
        lowFlatness = 0.001,
        // Use the same line width set by DrawItem.isPointInPath() before calling the native
        // isPointInStroke():
        lineWidth = (
            (this.lineWidth == null ? 1 : Math.max(1, this.lineWidth)) +
            2 * this.hitTolerance),
        curve = this._drawCurveToBezierCurve(this);

    var p1x = curve.p1x,
        p1y = curve.p1y,
        cp1x = curve.cp1x,
        cp1y = curve.cp1y,
        cp2x = curve.cp2x,
        cp2y = curve.cp2y,
        p2x = curve.p2x,
        p2y = curve.p2y;

    // Detect the cases where the Bezier curve is a single point (all control points are
    // equal) or has collinear control points.
    var pi2 = 2 * Math.PI,
        irregularStartPoint = (
            Math.abs(p1x - cp1x) < epsilon && Math.abs(p1y - cp1y) < epsilon),
        irregularEndPoint = (
            Math.abs(p2x - cp2x) < epsilon && Math.abs(p2y - cp2y) < epsilon),
        midpointX = (p1x + cp1x + cp2x + p2x) / 4,
        midpointY = (p1y + cp1y + cp2y + p2y) / 4,
        meanX = (p1x + cp1x + cp2x + p2x) / 4,
        meanY = (p1y + cp1y + cp2y + p2y) / 4,
        sxx = 0, sxy = 0, syy = 0,
        singlePoint = true;
    for (var i = 4; i--; ) {
        var x = 0, y = 0;
        if (i == 3) {
            x = p1x;
            y = p1y;
        } else if (i == 2) {
            x = cp1x;
            y = cp1y;
        } else if (i == 1) {
            x = cp2x;
            y = cp2y;
        } else {
            x = p2x;
            y = p2y;
        }
        var dx = x - meanX, dy = y - meanY;
        sxx += dx * dx;
        sxy += dx * dy;
        syy += dy * dy;

        if (isc.Math._hypot(x - midpointX, y - midpointY) >= epsilon) {
            singlePoint = false;
        }
    }


    var collinear = !singlePoint,
        phi = 0;
    if (collinear) {

        var numer = (syy - sxx + isc.Math._hypot(syy - sxx, 2 * sxy)),
            denom = 2 * sxy;
        phi = Math.atan2(numer, denom);


        var c = Math.cos(phi), s = Math.sin(phi),
            rho = meanX * s - meanY * c;
        for (var i = 0; collinear && i < 4; ++i) {
            var x = 0, y = 0;
            if (i == 3) {
                x = p1x; y = p1y;
            } else if (i == 2) {
                x = cp1x; y = cp1y;
            } else if (i == 1) {
                x = cp2x; y = cp2y;
            } else {
                x = p2x; y = p2y;
            }

            var sigma = x * c + y * s,
                dx = rho * s + sigma * c - x,
                dy = rho * -c + sigma * s - y,
                distance = isc.Math._hypot(dx, dy);

            collinear = (distance < 2 * Math.SQRT2);
        }
    }

    var halfLineWidth = lineWidth / 2;
    if (singlePoint) {
        var angle1 = 0, angle2 = 0;
        if (!(p1x == cp1x && p1y == cp1y)) {
            angle1 = Math.atan2(cp1y - p1y, cp1x - p1x);
        } else if (!(p1x == cp2x && p1y == cp2y)) {
            angle1 = Math.atan2(cp2y - p1y, cp2x - p1x);
        } else if (!(p1x == p2x && p1y == p2y)) {
            angle1 = Math.atan2(p2y - p1y, p2x - p1x);
        }
        if (!(p2x == cp2x && p2y == cp2y)) {
            angle2 = Math.atan2(cp2y - p2y, cp2x - p2x);
        } else if (!(p2x == cp1x && p2y == cp1y)) {
            angle2 = Math.atan2(cp1y - p2y, cp1x - p2x);
        } else if (!(p2x == p1x && p2y == p1y)) {
            angle2 = Math.atan2(p1y - p2y, p1x - p2x);
        }
        this._offsetCurveInfo = {
            halfLineWidth: halfLineWidth,
            singlePoint: true,
            collinear: false,
            midpointX: midpointX,
            midpointY: midpointY,
            angle1: angle1,
            angle2: angle2
        };
        return;
    }

    collinear = collinear || (irregularStartPoint && irregularEndPoint);
    if (collinear) {
        var xExtrema = isc.DrawPane.bezierExtrema(p1x, cp1x, cp2x, p2x),
            minX = xExtrema[0], maxX = xExtrema[1],
            yExtrema = isc.DrawPane.bezierExtrema(p1y, cp1y, cp2y, p2y),
            minY = yExtrema[0], maxY = yExtrema[1];

        // Determine if the line is from (minX, minY) to (maxX, maxY) or from (minX, maxY) to
        // (maxX, minY).
        var ux = Math.cos(phi), uy = -Math.sin(phi),
            x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        if (Math.abs(ux * (maxY - minY) + uy * (maxX - minX))
                < Math.abs(ux * (minY - maxY) + uy * (maxX - minX)))
        {
            x1 = minX;
            y1 = minY;
            x2 = maxX;
            y2 = maxY;
        } else {
            x1 = minX;
            y1 = maxY;
            x2 = maxX;
            y2 = minY;
        }

        var pi2 = 2 * Math.PI,
            angle = (pi2 + Math.atan2(y2 - y1, x2 - x1)) % pi2;
        this._offsetCurveInfo = {
            halfLineWidth: halfLineWidth,
            singlePoint: false,
            collinear: true,


            roundPoint1: !(x1 == p1x && y1 == p1y) && !(x1 == p2x && y1 == p2y),
            roundPoint2: !(x2 == p1x && y2 == p1y) && !(x2 == p2x && y2 == p2y),

            x1: x1,
            y1: y1,
            x1Left: x1 - halfLineWidth * Math.cos(Math.PI / 2 - angle),
            y1Left: y1 + halfLineWidth * Math.sin(Math.PI / 2 - angle),
            x1Right: x1 + halfLineWidth * Math.cos(Math.PI / 2 - angle),
            y1Right: y1 - halfLineWidth * Math.sin(Math.PI / 2 - angle),
            startAngle1: angle + Math.PI / 2,
            endAngle1: angle + 3 * Math.PI / 2,
            x2: x2,
            y2: y2,
            x2Left: x2 - halfLineWidth * Math.cos(Math.PI / 2 - angle),
            y2Left: y2 + halfLineWidth * Math.sin(Math.PI / 2 - angle),
            x2Right: x2 + halfLineWidth * Math.cos(Math.PI / 2 - angle),
            y2Right: y2 - halfLineWidth * Math.sin(Math.PI / 2 - angle),
            startAngle2: angle + Math.PI / 2,
            endAngle2: angle - Math.PI / 2,
            // The angle at which the "square" lineCap should start:
            angle: 3 * Math.PI / 4 - angle
        };
        return;
    }


    var ax = -p1x + 3 * (cp1x - cp2x) + p2x,
        ay = -p1y + 3 * (cp1y - cp2y) + p2y,
        bx = 3 * (p1x - cp1x - cp1x + cp2x),
        by = 3 * (p1y - cp1y - cp1y + cp2y),
        cx = 3 * (-p1x + cp1x),
        cy = 3 * (-p1y + cp1y),
        dx = p1x,
        dy = p1y;


    var xRoots = isc.Math._rpoly([3 * ax, 2 * bx, cx], 2).zeros,
        hasXRoot1 = (
            xRoots.length > 0 &&
            Math.abs(xRoots[0].imag) < epsilon),
        hasXRoot2 = (
            xRoots.length > 1 &&
            Math.abs(xRoots[1].imag) < epsilon),
        yRoots = null,
        hasYRoot1 = false, hasYRoot2 = false;

    if (hasXRoot1 || hasXRoot2) {
        yRoots = isc.Math._rpoly([3 * ay, 2 * by, cy], 2).zeros;
        hasYRoot1 = (
            yRoots.length > 0 &&
            Math.abs(yRoots[0].imag) < epsilon &&
            epsilon < yRoots[0].real && yRoots[0].real < 1 - epsilon);
        hasYRoot2 = (
            yRoots.length > 1 &&
            Math.abs(yRoots[1].imag) < epsilon &&
            epsilon < yRoots[1].real && yRoots[1].real < 1 - epsilon);
    }

    var roots = [];
    if (hasXRoot1 && hasYRoot1 && Math.abs(xRoots[0].real, yRoots[0].real) < epsilon) {
        roots.push((xRoots[0].real + yRoots[0].real) / 2);
    }
    if (hasXRoot1 && hasYRoot2 && Math.abs(xRoots[0].real, yRoots[1].real) < epsilon) {
        roots.push((xRoots[0].real + yRoots[1].real) / 2);
    }
    if (hasXRoot2 && hasYRoot1 && Math.abs(xRoots[1].real, yRoots[0].real) < epsilon) {
        roots.push((xRoots[1].real + yRoots[0].real) / 2);
    }
    if (hasXRoot2 && hasYRoot2 && Math.abs(xRoots[1].real, yRoots[1].real) < epsilon) {
        roots.push((xRoots[1].real + yRoots[1].real) / 2);
    }
    for (var i = roots.length; i--; ) {
        var root = roots[i];
        if (root < -epsilon || root > 1 + epsilon) {
            roots.splice(i, 1);
        } else if (root < epsilon) {
            irregularStartPoint = true;
            roots.splice(i, 1);
        } else if (root > 1 - epsilon) {
            irregularEndPoint = true;
            roots.splice(i, 1);
        }
    }
    // Sort the roots in ascending order.
    for (var i = 1; i < roots.length; ++i) {
        for (var j = i; roots[j - 1] > roots[j]; --j) {
            var swap = roots[j - 1];
            roots[j - 1] = roots[j];
            roots[j] = swap;
        }
    }


    var leftPath = [],
        rightPath = [];

    // Calculate the first point of the left path and the first point of the right path.
    var halfLineWidth = lineWidth / 2,
        cp1xmp1x = cp1x - p1x,
        cp1ymp1y = cp1y - p1y,
        sDenom = isc.Math._hypot(cp1xmp1x, cp1ymp1y),
        ux = cp1ymp1y / sDenom,
        uy = -cp1xmp1x / sDenom;
    leftPath.push(p1x + halfLineWidth * ux, p1y + halfLineWidth * uy);
    var cp2xmp2x = cp2x - p2x,
        cp2ymp2y = cp2y - p2y,
        z = isc.Math._hypot(cp2xmp2x, cp2ymp2y),
        vx = cp2ymp2y / z,
        vy = -cp2xmp2x / z;


    var head = this._bezierCurveZero(),
        tail = this._bezierCurveZero(),
        work = this._bezierCurveZero(),
        temp = this._bezierCurveZero();

    roots.unshift(0);
    roots.push(1);
    var numRoots = roots.length;
    for (var i = 1; i < numRoots; ++i) {
        var rleft = roots[i - 1], rright = roots[i];

        // Copy the subcurve of `curve` from `t = rleft` to `t = rright` into the `temp` curve.
        if (numRoots == 2) {
            this._bezierCurveCopy(curve, temp);
        } else {
            if (1 < i) {
                this._bezierCurveDeCasteljau(curve, rleft, null, temp);
            }
            if (i < numRoots - 1) {
                this._bezierCurveDeCasteljau(
                    (1 < i ? temp : curve), (rright - rleft) / (1 - rleft), temp, null);
            }
        }

        var leftFlag = (
                (1 < i &&
                    isc.Math._hypot(temp.cp1x - temp.p1x, temp.cp2x - temp.p2x) < epsilon) ||
                irregularStartPoint),
            rightFlag = (
                (i < numRoots - 1 &&
                    isc.Math._hypot(temp.cp2x - temp.p2x, temp.cp2y - temp.p2y) < epsilon) ||
                irregularEndPoint);
        if (leftFlag && rightFlag) {

            this._addOffsetLineToPath(lineWidth, temp, leftPath, rightPath);
        } else {
            this._addOffsetCurveToPath(
                lineWidth, flatness, lowFlatness, temp, leftFlag, rightFlag, leftPath,
                rightPath, head, tail, work);
        }
    }

    // Reverse the right path so that the paths can be concatenated into a closed path.
    rightPath.push(p2y + halfLineWidth * vy, p2x + halfLineWidth * vx);
    rightPath = rightPath.reverse();




    var pi2 = 2 * Math.PI,
        x1Left = leftPath[0],
        y1Left = leftPath[1],
        x1Right = rightPath[rightPath.length - 2],
        y1Right = rightPath[rightPath.length - 1],
        x2Left = leftPath[leftPath.length - 2],
        y2Left = leftPath[leftPath.length - 1],
        x2Right = rightPath[0],
        y2Right = rightPath[1],
        // The angles for `lineCap: "round"`:
        startAngle1 = (Math.PI + Math.atan2(y1Left - y1Right, x1Left - x1Right)) % pi2,
        endAngle1 = startAngle1 + Math.PI,
        endAngle2 = (pi2 + Math.PI + Math.atan2(y2Left - y2Right, x2Left - x2Right)) % pi2,
        startAngle2 = endAngle2 - Math.PI,
        // The corner points for `lineCap: "square"`:
        theta1 = 3 * Math.PI / 2 - startAngle1,
        leftCorner1x = x1Right + halfLineWidth * Math.cos(theta1),
        leftCorner1y = y1Right - halfLineWidth * Math.sin(theta1),
        rightCorner1x = x1Left + halfLineWidth * Math.cos(theta1),
        rightCorner1y = y1Left - halfLineWidth * Math.sin(theta1),
        theta2 = 3 * Math.PI / 2 - startAngle2,
        leftCorner2x = x2Left + halfLineWidth * Math.cos(theta2),
        leftCorner2y = y2Left - halfLineWidth * Math.sin(theta2),
        rightCorner2x = x2Right + halfLineWidth * Math.cos(theta2),
        rightCorner2y = y2Right - halfLineWidth * Math.sin(theta2);

    this._offsetCurveInfo = {
        halfLineWidth: halfLineWidth,
        singlePoint: false,
        collinear: false,


        leftPath: leftPath,
        rightPath: rightPath,

        // Precalculated arguments for the lineCap near the start point:
        x1: (x1Left + x1Right) / 2,
        y1: (y1Left + y1Right) / 2,
        radius1: isc.Math._hypot(x1Left - x1Right, y1Left - y1Right) / 2,
        startAngle1: startAngle1,
        endAngle1: endAngle1,
        leftCorner1x: leftCorner1x,
        leftCorner1y: leftCorner1y,
        rightCorner1x: rightCorner1x,
        rightCorner1y: rightCorner1y,

        // Precalculated arguments for the lineCap near the end point:
        x2: (x2Left + x2Right) / 2,
        y2: (y2Left + y2Right) / 2,
        radius2: isc.Math._hypot(x2Left - x2Right, y2Left - y2Right) / 2,
        startAngle2: startAngle2,
        endAngle2: endAngle2,
        leftCorner2x: leftCorner2x,
        leftCorner2y: leftCorner2y,
        rightCorner2x: rightCorner2x,
        rightCorner2y: rightCorner2y
    };
},


_addOffsetCurveToPath : function (
    lineWidth, flatness, lowFlatness, curve, irregularStartPoint, irregularEndPoint, leftPath,
    rightPath, head, tail, work)
{

    var epsilon = 1e-6,
        p1x = curve.p1x, p1y = curve.p1y,
        cp1x = curve.cp1x, cp1y = curve.cp1y,
        cp2x = curve.cp2x, cp2y = curve.cp2y,
        p2x = curve.p2x, p2y = curve.p2y,
        ax = -p1x + 3 * (cp1x - cp2x) + p2x, ay = -p1y + 3 * (cp1y - cp2y) + p2y,
        bx = 3 * (p1x - cp1x - cp1x + cp2x), by = 3 * (p1y - cp1y - cp1y + cp2y),
        cx = 3 * (-p1x + cp1x), cy = 3 * (-p1y + cp1y),
        dx = p1x, dy = p1y;

    var denom = (ay * bx - ax * by),
        tCusp = 0,
        t1 = 0,
        t2 = 0,
        noInflectionPoints = false;
    if (Math.abs(denom) < epsilon) {
        var denom2 = (ay * cx - ax * cy);
        if (Math.abs(denom2) < epsilon) {
            // Move the (nonexistent) inflection points out of the [0, 1] interval.
            tCusp = t1 = t2 = -1;
            noInflectionPoints = true;
        } else {
            tCusp = t1 = t2 = -(by * cx - bx * cy) / (3 * denom2);
        }
    } else {
        tCusp = -(ay * cx - ax * cy) / (2 * denom);
        var discriminant = tCusp * tCusp - (by * cx - bx * cy) / (3 * denom);
        if (discriminant <= 0) {
            t1 = t2 = tCusp;
        } else {
            var sqrtDiscriminant = Math.sqrt(discriminant);
            t1 = tCusp - sqrtDiscriminant;
            t2 = tCusp + sqrtDiscriminant;
        }
    }

    if (t2 - t1 < epsilon) {
        tCusp = t1 = t2 = (t1 + t2) / 2;
    }

    var tf1 = 0;
    if (-epsilon < t1 && t1 < 1 + epsilon) {
        if (t1 > 0.5) {
            this._bezierCurveDeCasteljau(curve, t1, tail, null);
            this._bezierCurveReverse(tail, tail);
        } else {
            this._bezierCurveDeCasteljau(curve, t1, null, tail);
        }
        var rs = this._xyToRS(tail);
        if (rs == null) {
            t1 = -1;
        } else {
            tf1 = Math.pow(Math.abs(lowFlatness / rs.s3), 1 / 3);
        }
    }
    var tf2 = 0;
    if (t1 == t2) {
        tf2 = tf1;
    } else if (t2 < 1 + epsilon) {
        if (t2 > 0.5) {
            this._bezierCurveDeCasteljau(curve, t2, tail, null);
            this._bezierCurveReverse(tail, tail);
        } else {
            this._bezierCurveDeCasteljau(curve, t2, null, tail);
        }
        var rs = this._xyToRS(tail);
        if (rs == null) {
            t2 = t1;
        } else {
            tf2 = Math.pow(Math.abs(lowFlatness / rs.s3), 1 / 3);
        }
    }

    var epsilon2 = 1000 * epsilon,
        t1Minus = Math.min(t1 - epsilon2, t1 - tf1 * (1 - t1)),
        t1Plus = Math.max(t1 + epsilon2, t1 + tf1 * (1 - t1)),
        t2Minus = Math.min(t2 - epsilon2, t2 - tf2 * (1 - t2)),
        t2Plus = Math.max(t2 + epsilon2, t2 + tf2 * (1 - t2)),
        tValues = (t1 == t2 ? [t1] : [t1, t2]),
        tMinusValues = (t1 == t2 ? [t1Minus] : [t1Minus, t2Minus]),
        tPlusValues = (t1 == t2 ? [t1Plus] : [t1Plus, t2Plus]),
        t1Index = 0,
        t2Index = (t1 == t2 ? t1Index : 1);

    var ax2 = ax * ax, ax3 = ax * ax2,
        ay2 = ay * ay, ay3 = ay * ay2,
        bx2 = bx * bx, bx3 = bx * bx2,
        by2 = by * by, by3 = by * by2,
        cx2 = cx * cx, cx3 = cx * cx2,
        cy2 = cy * cy, cy3 = cy * cy2;


    var a5 = 36 * (ax2 + ay2) * (ax * by - bx * ay),
        a4 = 15 * (
            3 * (ax2 + ay2) * (ax * cy - cx * ay) - 2 * ax * ay * (bx2 - by2) +
            2 * (ax2 - ay2) * bx * by),
        a3 = 4 * (
            3 * (4 * ax * ay * by + ay2 * bx + 5 * ax2 * bx) * cy -
            3 * (5 * ay2 * by + ax2 * by + 4 * ax * ay * bx) * cx +
            (ax * by - bx * ay) * (bx2 + by2)),
        a2 = 2 * (
            -6 * ax * ay * (cx2 - cy2) + 6 * (ax2 - ay2) * cx * cy +
            (3 * ax * by2 + 10 * ay * bx * by + 13 * ax * bx2) * cy -
            (13 * ay * by2 + 10 * ax * bx * by + 3 * ay * bx2) * cx),
        a1 = 4 * (2 * (ax * cx + ay * cy) + bx2 + by2) * (bx * cy - cx * by),
        a0 = (
            -ax * cy3 + ay * cx3 + cx * cy * (ay * cy - ax * cx) + 2 * (bx2 - by2) * cx * cy -
            2 * bx * by * (cx2 - cy2));


    var epsilon3 = 10 * epsilon2,
        zeros = isc.Math._rpoly([a5, a4, a3, a2, a1, a0], 5).zeros;
    for (var i = zeros.length; i--; ) {
        var z = zeros[i];
        if (-epsilon < zeros[i].real && zeros[i].real < 1 + epsilon && Math.abs(z.imag) < epsilon) {
            var root = zeros[i].real,
                unique = true;
            for (var j = tValues.length; unique && j--; ) {
                unique = (Math.abs(root - tValues[j]) >= epsilon);
            }
            if (!unique) {
                continue;
            }

            tValues.push(root);
            this._bezierCurveDeCasteljau(curve, root, null, work);
            var rs = this._xyToRS(work),
                r1 = rs.r1,
                s2 = rs.s2,
                absS2 = Math.abs(s2),
                ratio = lineWidth * s2 / (3 * r1 * r1),
                halfT2 = 0;
            if (ratio < 1 + epsilon) {
                halfT2 = flatness / (3 * absS2 * (1 - ratio));
            }
            if (ratio > -1 + epsilon) {
                halfT2 = Math.max(halfT2, flatness / (3 * absS2 * (1 + ratio)));
            }
            var t = 2 * Math.sqrt(halfT2);
            tMinusValues.push(Math.min(root - epsilon3, root - t * (1 - root)));
            tPlusValues.push(Math.max(root + epsilon3, root + t * (1 - root)));
        }
    }

    // Sort tValues in ascending order.  Apply the sort order to tMinusValues/tPlusValues.
    for (var i = 1; false && i < tValues.length; ++i) {
        for (var j = i; tValues[j - 1] > tValues[j]; --j) {
            var swap = tValues[j - 1];
            tValues[j - 1] = tValues[j];
            tValues[j] = swap;

            swap = tMinusValues[j - 1];
            tMinusValues[j - 1] = tMinusValues[j];
            tMinusValues[j] = swap;

            swap = tPlusValues[j - 1];
            tPlusValues[j - 1] = tPlusValues[j];
            tPlusValues[j] = swap;

            if (j == t1Index) {
                t1Index = j - 1;
            } else if (j - 1 == t1Index) {
                t1Index = j;
            } else if (j == t2Index) {
                t2Index = j - 1;
            } else if (j - 1 == t2Index) {
                t2Index = j;
            }
        }
    }


    // Create a list of the t-values at which to segment the curve and for each segment mark
    // which helper method to use to generate the offset curves over the segment.
    var useLine = 0, useRegularFlatnessCurve = 1, useLowFlatnessCurve = 2,
        t1t2IntervalsOverlap = (t1 != t2 && t2Minus <= t1Plus),
        ts = [0],
        which = [];
    for (var t = 0; t < 1; ) {
        var tInT1Interval = (t1Minus <= t && t < t1Plus),
            tInT2Interval = (t1 != t2 && t2Minus <= t && t < t2Plus),
            flag = useRegularFlatnessCurve,
            nextT = t,
            tInHighCurvatureInterval = false;
        for (var i = 0; !tInHighCurvatureInterval && i < tValues.length; ++i) {
            tInHighCurvatureInterval = (
                i != t1Index && i != t2Index &&
                tMinusValues[i] <= t && t < tPlusValues[i]);
        }

        if (tInT1Interval || tInT2Interval) {
            flag = useLine;
        } else if (tInHighCurvatureInterval) {
            flag = useLowFlatnessCurve;
        } else {
            flag = useRegularFlatnessCurve;
        }
        if (t1t2IntervalsOverlap && t1Minus <= t && t < tCusp) {
            nextT = tCusp;
        } else if (t1t2IntervalsOverlap && tCusp <= t && t < t2Plus) {
            nextT = t2Plus;
        } else if (tInT1Interval) {
            nextT = t1Plus;
        } else if (tInT2Interval) {
            nextT = t2Plus;
        } else if (tInHighCurvatureInterval) {
            nextT = 2;
            for (var i = 0; i < tValues.length; ++i) {
                if (i != t1Index && i != t2Index && t < tValues[i]) {
                    nextT = Math.min(nextT, tValues[i]);
                }
                if (tMinusValues[i] <= t && t < tPlusValues[i]) {
                    nextT = Math.min(nextT, tPlusValues[i]);
                }
            }
        } else {
            nextT = 2;
            for (var i = 0; i < tValues.length; ++i) {
                if (t < tMinusValues[i]) {
                    nextT = Math.min(nextT, tMinusValues[i]);
                }
            }
        }

        nextT = Math.min(nextT, 1);
        ts.push(nextT);
        which.push(flag);
        t = nextT;
    }

    for (var i = 0; i < which.length; ++i) {
        var tl = ts[i], th = ts[i + 1], flag = which[i], last = (i == which.length - 1);

        // Subdivide the original curve from `tl` to `th`.
        if (last) {
            head = curve;
        } else {
            this._bezierCurveDeCasteljau(curve, (th - tl) / (1 - tl), head, curve);
        }

        // Approximate the offset curves over the subcurve.
        if (flag == useLine) {
            this._addOffsetLineToPath(lineWidth, head, leftPath, rightPath);
        } else {
            var f = (flag == useRegularFlatnessCurve ? flatness : lowFlatness);
            this._addOffsetSimpleCurveToPath(f, lineWidth, head, leftPath, rightPath, work);
        }
    }
},


_xyToRS : function (curve) {
    var epsilon = 1e-6,
        cp1xmp1x = curve.cp1x - curve.p1x,
        cp1ymp1y = curve.cp1y - curve.p1y,
        distCp1P1 = isc.Math._hypot(cp1xmp1x, cp1ymp1y);

    var dx = 0, dy = 0, dist = 0;
    if (distCp1P1 < epsilon) {
        var cp2xmcp1x = curve.cp2x - curve.cp1x,
            cp2ymcp1y = curve.cp2y - curve.cp1y,
            distCp2Cp1 = isc.Math._hypot(cp2xmcp1x, cp2ymcp1y);
        if (distCp2Cp1 < epsilon) {
            var p2xmp1x = curve.p2x - curve.p1x,
                p2ymp1y = curve.p2y - curve.p1y,
                distP2P1 = isc.Math._hypot(p2xmp1x, p2ymp1y);
            if (distP2P1 < epsilon) {
                return null;
            } else {
                // Let the `r` axis run along the line from the start point to the end point.
                dx = p2xmp1x;
                dy = p2ymp1y;
                dist = distP2P1;
            }
        } else {
            // Let the `r` axis be oriented along the acceleration vector of the curve
            // at t = 0:
            dx = cp2xmcp1x;
            dy = cp2ymcp1y;
            dist = distCp2Cp1;
        }
    } else {

        dx = cp1xmp1x;
        dy = cp1ymp1y;
        dist = distCp1P1;
    }

    var x0 = curve.p1x, y0 = curve.p1y,
        dx0 = curve.p1x - x0,
        dy0 = curve.p1y - y0,
        dx1 = curve.cp1x - x0,
        dy1 = curve.cp1y - y0,
        dx2 = curve.cp2x - x0,
        dy2 = curve.cp2y - y0,
        dx3 = curve.p2x - x0,
        dy3 = curve.p2y - y0;
    return {
        r0: (dx0 * dx + dy0 * dy) / dist,
        s0: (dx0 * dy - dy0 * dx) / dist,
        r1: (dx1 * dx + dy1 * dy) / dist,
        s1: (dx1 * dy - dy1 * dx) / dist,
        r2: (dx2 * dx + dy2 * dy) / dist,
        s2: (dx2 * dx - dy2 * dx) / dist,
        r3: (dx3 * dx + dy3 * dy) / dist,
        s3: (dx3 * dy - dy3 * dx) / dist
    };
},

_addOffsetLineToPath : function (lineWidth, curve, leftPath, rightPath) {
    var epsilon = 1e-6,
        x0 = curve.p1x,
        y0 = curve.p1y,
        x1 = curve.p2x,
        y1 = curve.p2y,
        dx = x1 - x0,
        dy = y1 - y0,
        dist = isc.Math._hypot(dx, dy);
    if (!(dist < epsilon)) {
        var scale = lineWidth / (2 * dist),
            ux = dy * scale,
            uy = -dx * scale;
        leftPath.push(x1 + ux, y1 + uy);
        // The right path will be reverse()d later.
        rightPath.push(y0 - uy, x0 - ux);
    }
},

_addOffsetSimpleCurveToPath : function (flatness, lineWidth, curve, leftPath, rightPath, workCurve) {

    var epsilon = 1e-6,
        origCurve = curve;

    for (var dir = 0; dir < 2; ++dir) {
        var left = true,
            rightPathStartIndex = 0;
        if (dir == 0) {
            left = true;
        } else if (dir == 1) {
            left = false;
            this._bezierCurveReverse(origCurve, origCurve);
            rightPathStartIndex = rightPath.length;
        }
        curve = this._bezierCurveCopy(origCurve, workCurve);

        var globalT = 0;
        for (var notDone = true; notDone; ) {
            var p1x = curve.p1x,
                p1y = curve.p1y,
                cp1x = curve.cp1x,
                cp1y = curve.cp1y,
                cp2x = curve.cp2x,
                cp2y = curve.cp2y,
                p2x = curve.p2x,
                p2y = curve.p2y;

            var cp1xmp1x = cp1x - p1x,
                cp1ymp1y = cp1y - p1y,
                rsDenom = isc.Math._hypot(cp1xmp1x, cp1ymp1y),
                r1 = ((cp1x - p1x) * cp1xmp1x + (cp1y - p1y) * cp1ymp1y) / rsDenom,
                s2 = ((cp2x - p1x) * cp1ymp1y - (cp2y - p1y) * cp1xmp1x) / rsDenom,
                radius = 3 * r1 * r1 / 2 / s2,
                diameter = 2 * radius,
                ds2d3r12 = lineWidth / diameter,
                outside = (diameter >= (left ? lineWidth : -lineWidth)),
                absS2 = Math.abs(s2),
                tDenom = 3 * absS2 * (left ? (1 - ds2d3r12) : (1 + ds2d3r12)),
                addLineSegment = (tDenom > 0);
            if (!left) {
                var rs = this._xyToRS(curve);
            }
            if (!addLineSegment) {
                tDenom = -tDenom;
            }

            var t = 2 * Math.sqrt(flatness / tDenom);
            globalT = globalT + t * (1 - globalT);
            notDone = (globalT < 1 - epsilon);
            if (notDone) {
                this._bezierCurveDeCasteljau(origCurve, globalT, null, curve);
            } else {
                t = globalT = 1;
            }

            if (notDone) {
                var vx = 3 * (-curve.cp1x + curve.p1x),
                    vy = 3 * (-curve.cp1y + curve.p1y),
                    scale = lineWidth / (2 * isc.Math._hypot(vx, vy)),
                    ux = -vy * scale,
                    uy = vx * scale;
                if (left) {
                    leftPath.push(curve.p1x + ux, curve.p1y + uy);
                } else {
                    // The right path will be reverse()d later.
                    rightPath.push(curve.p1y + uy, curve.p1x + ux);
                }
            } else {
                var vx = -3 * (-cp2x + curve.p2x),
                    vy = -3 * (-cp2y + p2y),
                    scale = lineWidth / (2 * isc.Math._hypot(vx, vy)),
                    ux = -vy * scale,
                    uy = vx * scale;
                if (left) {
                    leftPath.push(curve.p2x + ux, curve.p2y + uy);
                } else {
                    // The right path will be reverse()d later.
                    rightPath.push(curve.p2y + uy, curve.p2x + ux);
                }
            }
        }

        if (!left) {
            var rightPathLen = rightPath.length;
            for (var i = rightPathStartIndex, j = rightPathLen - 2; i < j; i += 2, j -= 2) {
                var swap = rightPath[i];
                rightPath[i] = rightPath[j];
                rightPath[j] = swap;
                swap = rightPath[i + 1];
                rightPath[i + 1] = rightPath[j + 1];
                rightPath[j + 1] = swap;
            }
        }
    }

    this._bezierCurveReverse(origCurve, origCurve);
},


_isPointInStroke : function (context, x, y) {

    // If either argument is infinite or NaN then isPointInStroke() should return false.
    if (!(isc.isA.Number(x) && isc.isA.Number(y))) {
        return false;
    }

    context.save();
    var info = this._offsetCurveInfo,
        halfLineWidth = info.halfLineWidth;


    var isPointInStroke = false;
    if (info.singlePoint) {
        var x0 = info.midpointX, y0 = info.midpointY;
        if (this.lineCap == "square") {
            var radius = halfLineWidth * Math.SQRT2,
                c = Math.cos(info.angle1),
                s = Math.sin(info.angle1),
                startX = x0 + radius * c,
                startY = y0 - radius * s;
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(x0 + radius * s, y0 + radius * c);
            context.lineTo(x0 - radius * c, y0 + radius * s);
            context.lineTo(x0 - radius * s, y0 - radius * c);
            context.lineTo(startX, startY);
            context.closePath();
            isPointInStroke = context.isPointInPath(x, y);

            if (!isPointInStroke && info.angle2 != info.angle1) {
                c = Math.cos(info.angle2);
                s = Math.sin(info.angle2);
                context.beginPath();
                context.moveTo(x0 + radius * c, y0 - radius * s);
                context.lineTo(x0 + radius * s, y0 + radius * c);
                context.lineTo(x0 - radius * c, y0 + radius * s);
                context.lineTo(x0 - radius * s, y0 - radius * c);
                context.lineTo(x0 + radius * c, y0 - radius * s);
                context.moveTo(startX, startY);
                context.closePath();
            }
            context.closePath();
        } else if (this.lineCap == "round") {
            context.beginPath();
            context.moveTo(x0 + halfLineWidth, y0);
            context.arc(x0, y0, halfLineWidth, 0, 360, false);
            context.closePath();
            isPointInStroke = context.isPointInPath(x, y);
        }
        // Nothing is drawn for `lineCap: "butt"`.

    } else if (info.collinear) {
        context.beginPath();
        context.moveTo(info.x1Left, info.y1Left);
        context.lineTo(info.x2Left, info.y2Left);
        if (info.roundPoint2 || this.lineCap == "round") {
            context.arc(
                info.x2, info.y2, halfLineWidth, info.startAngle2, info.endAngle2);
        } else {
            context.lineTo(info.x2Right, info.y2Right);
        }
        context.lineTo(info.x1Right, info.y1Right);
        if (info.roundPoint1 || this.lineCap == "round") {
            context.arc(
                info.x1, info.y1, halfLineWidth, info.startAngle1, info.endAngle1);
        }
        context.lineTo(info.x1Left, info.y1Left);
        context.closePath();
        isPointInStroke = context.isPointInPath(x, y);

        // Draw the square lineCaps separately.
        if (!isPointInStroke && this.lineCap == "square") {
            var radius = halfLineWidth * Math.SQRT2,
                c = Math.cos(info.angle),
                s = Math.sin(info.angle);

            if (!info.roundPoint1) {
                var x0 = info.x1, y0 = info.y1;
                context.beginPath();
                context.moveTo(x0 + radius * c, y0 - radius * s);
                context.lineTo(x0 + radius * s, y0 + radius * c);
                context.lineTo(x0 - radius * c, y0 + radius * s);
                context.lineTo(x0 - radius * s, y0 - radius * c);
                context.lineTo(x0 + radius * c, y0 - radius * s);
                context.closePath();
                isPointInStroke = context.isPointInPath(x, y);
            }
            if (!isPointInStroke && !info.roundPoint2) {
                var x0 = info.x2, y0 = info.y2;
                context.beginPath();
                context.moveTo(x0 + radius * c, y0 - radius * s);
                context.lineTo(x0 + radius * s, y0 + radius * c);
                context.lineTo(x0 - radius * c, y0 + radius * s);
                context.lineTo(x0 - radius * s, y0 - radius * c);
                context.lineTo(x0 + radius * c, y0 - radius * s);
                context.closePath();
                isPointInStroke = context.isPointInPath(x, y);
            }
        }

    } else {
        var leftPath = info.leftPath,
            rightPath = info.rightPath;
        context.beginPath();
        context.moveTo(leftPath[0], leftPath[1]);
        for (var i = 2, leftPathLen = leftPath.length; i < leftPathLen; i += 2) {
            context.lineTo(leftPath[i], leftPath[i + 1]);
        }
        if (this.lineCap == "round") {
            context.arc(info.x2, info.y2, info.radius2, info.startAngle2, info.endAngle2, false);
        } else if (this.lineCap == "square") {
            context.lineTo(info.leftCorner2x, info.leftCorner2y);
            context.lineTo(info.rightCorner2x, info.rightCorner2y);
        } else { // this.lineCap == "butt", or the default case
            context.lineTo(rightPath[0], rightPath[1]);
        }
        for (var i = 2, rightPathLen = rightPath.length; i < rightPathLen; i += 2) {
            context.lineTo(rightPath[i], rightPath[i + 1]);
        }
        if (this.lineCap == "round") {
            context.arc(info.x1, info.y1, info.radius1, info.startAngle1, info.endAngle1, false);
        } else if (this.lineCap == "square") {
            context.lineTo(info.leftCorner1x, info.leftCorner1y);
            context.lineTo(info.rightCorner1x, info.rightCorner1y);
        }
        context.closePath();
        isPointInStroke = context.isPointInPath(x, y);
    }


    var arrowDelta = 10,
        lineWidth = 2 * halfLineWidth;
    if (!isPointInStroke && (this.startArrow == "open" || this.startArrow == "block")) {
        var originX = this.startPoint[0],
            originY = this.startPoint[1],
            point = this.computeBezierPoint(0.01),
            angle = this.computeAngle(originX, originY, point[0], point[1]) * this._radPerDeg,
            c = Math.cos(-angle), s = Math.sin(-angle),
            x1 = originX,
            y1 = originY,
            x0 = (c - s) * arrowDelta + x1,
            y0 = -(s + c) * arrowDelta + y1,
            x2 = (c + s) * arrowDelta + x1,
            y2 = (-s + c) * arrowDelta + y1;

        isPointInStroke = (
            isc.Math.euclideanDistanceToLine(
                x0, y0, x1, y1, x, y) <= lineWidth ||
            isc.Math.euclideanDistanceToLine(
                x1, y1, x2, y2, x, y) <= lineWidth ||
            (this.startArrow == "block" && isc.Math.euclideanDistanceToLine(
                x2, y2, x0, y0, x, y) <= lineWidth));
    }
    if (!isPointInStroke && (this.endArrow == "open" || this.endArrow == "block")) {
        var originX = this.endPoint[0],
            originY = this.endPoint[1],
            point = this.computeBezierPoint(0.99),
            angle = this.computeAngle(point[0], point[1], originX, originY) * this._radPerDeg,
            c = Math.cos(-angle), s = Math.sin(-angle),
            x1 = originX,
            y1 = originY,
            x0 = (-c + s) * arrowDelta + x1,
            y0 = (s + c) * arrowDelta + y1,
            x2 = -(c + s) * arrowDelta + x1,
            y2 = (s - c) * arrowDelta + y1;

        isPointInStroke = (
            isc.Math.euclideanDistanceToLine(
                x0, y0, x1, y1, x, y) <= lineWidth ||
            isc.Math.euclideanDistanceToLine(
                x1, y1, x2, y2, x, y) <= lineWidth ||
            (this.endArrow == "block" && isc.Math.euclideanDistanceToLine(
                x2, y2, x0, y0, x, y) <= lineWidth));
    }

    context.restore();

    return isPointInStroke;
},

//----------------------------------------
//  DrawCurve attribute setters
//----------------------------------------

//> @method drawCurve.setStartPoint()
// @include drawLine.setStartPoint
//<
setStartPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    if (left != null) this.startPoint[0] = left;
    if (top != null) this.startPoint[1] = top;
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }
    if (this.drawingVML) {
        this._getVMLHandle().from = this.startPoint[0] + " " + this.startPoint[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

//> @method drawCurve.setEndPoint()
// @include drawLine.setEndPoint
//<
setEndPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }
    if (left != null) this.endPoint[0] = left;
    if (top != null) this.endPoint[1] = top;
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }
    if (this.drawingVML) {
        this._getVMLHandle().to = this.endPoint[0] + " " + this.endPoint[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},


//> @method drawCurve.setControlPoint1()
// Update the first cubic bezier control point
//
// @param left (int) left coordinate for control point, in pixels
// @param left (int) top coordinate for control point, in pixels
// @visibility drawing
//<
setControlPoint1 : function (left, top) {
    if (left != null) this.controlPoint1[0] = left;
    if (top != null) this.controlPoint1[1] = top;
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }
    if (this.drawingVML) {
        this._getVMLHandle().control1 = this.controlPoint1[0] + " " + this.controlPoint1[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

//> @method drawCurve.setControlPoint2()
// Update the second cubic bezier control point
//
// @param left (int) left coordinate for control point, in pixels
// @param left (int) top coordinate for control point, in pixels
// @visibility drawing
//<
setControlPoint2 : function (left, top) {
    if (left != null) this.controlPoint2[0] = left;
    if (top != null) this.controlPoint2[1] = top;
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }
    if (this.drawingVML) {
        this._getVMLHandle().control2 = this.controlPoint2[0] + " " + this.controlPoint2[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

// Override DrawItem.setLineWidth() so that the offset curves can be updated.
setLineWidth : function (width) {
    if (width != null) {
        var prevLineWidth = (this.lineWidth == null ? 1 : Math.max(1, this.lineWidth));
        this.lineWidth = width;
        if (!isc.Browser._supportsCanvasIsPointInStroke) {
            var newLineWidth = (this.lineWidth == null ? 1 : Math.max(1, this.lineWidth));
            if (prevLineWidth != newLineWidth) {
                this._calculateOffsetCurvePath();
            }
        }
    }
    return this.Super("setLineWidth", arguments);
},

//> @method drawCurve.getBoundingBox()
// Returns the smallest box containing the entire curve.
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var epsilon = 1e-6,
        box = (outputBox || new Array(4));
    for (var k = 0; k < 2; ++k) {
        var x = this.startPoint[k],
            y = this.controlPoint1[k],
            z = this.controlPoint2[k],
            w = this.endPoint[k],
            extrema = isc.DrawPane.bezierExtrema(x, y, z, w);

        box[k] = extrema[0];
        box[k + 2] = extrema[1];
    }

    return includeStroke != true ? box : this._adjustBoundingBoxForStroke(box);
},

// Support control knobs for start point, end point and control points.
// (Documented under DrawKnobs type definition)

showResizeKnobs : null,
hideResizeKnobs : null,

showMoveKnobs : null,
hideMoveKnobs : null,

// Note: can't borrow from drawLine - we have startPoint (two element array) rather than
// startLeft / endLeft
showStartPointKnobs : function () {
    if (this._startKnob != null && !this._startKnob.destroyed) return;

    this._startKnob = this.createAutoChild("startKnob", {
        _constructor: "DrawKnob",
        x: this.startPoint[0],
        y: this.startPoint[1],
        drawPane: this.drawPane,
        _targetShape: this,

        updatePoints : function (x, y, dx, dy, state) {
            var drawItem = this._targetShape;
            if (state == "start") {
                drawItem._dragStartPointControlPoint1 = drawItem.controlPoint1.duplicate();
                drawItem._dragStartPointControlPoint2 = drawItem.controlPoint2.duplicate();
            }
            var controlPoint1 = drawItem._dragStartPointControlPoint1,
                controlPoint2 = drawItem._dragStartPointControlPoint2;

            if (drawItem.keepInParentRect) {
                var box = drawItem._getParentRect(),
                    curve = {
                        startPoint: [x, y],
                        controlPoint1: controlPoint1.duplicate(),
                        controlPoint2: controlPoint2.duplicate(),
                        endPoint: drawItem.endPoint
                    };

                drawItem._intersectCurveBox(curve.endPoint, curve, box);

                var newStartPoint = curve.startPoint,
                    newControlPoint1 = curve.controlPoint1,
                    newControlPoint2 = curve.controlPoint2;

                drawItem.setStartPoint(newStartPoint[0], newStartPoint[1]);
                if (drawItem.controlPoint1[0] != newControlPoint1[0] ||
                    drawItem.controlPoint1[1] != newControlPoint1[1])
                {
                    drawItem.setControlPoint1(newControlPoint1[0], newControlPoint1[1]);
                }
                if (drawItem.controlPoint2[0] != newControlPoint2[0] ||
                    drawItem.controlPoint2[1] != newControlPoint2[1])
                {
                    drawItem.setControlPoint2(newControlPoint2[0], newControlPoint2[1]);
                }
            } else {
                drawItem.setStartPoint(x, y);
            }

            if (state == "stop") {
                delete drawItem._dragStartPointControlPoint1;
                delete drawItem._dragStartPointControlPoint2;
            }
        }
    });
},


_intersectCurveBox : function (fixedPoint, curve, box) {

    var box0 = Math.min(box[0], box[2]),
        box1 = Math.min(box[1], box[3]),
        box2 = Math.max(box[0], box[2]),
        box3 = Math.max(box[1], box[3]);
    box[0] = box0;
    box[1] = box1;
    box[2] = box2;
    box[3] = box3;

    // Flip the curve so that the fixedPoint is the same as curve.startPoint.  The curve
    // will be flipped back at the end of this method.
    var backward = (fixedPoint == curve.endPoint);
    if (backward) {
        this._backward(curve);
    }


    var epsilon = 1e-6,
        startPoint = curve.startPoint,
        endPoint = curve.endPoint,
        startPointWithinBound = (
            box[0] <= startPoint[0] && startPoint[0] <= box[2] &&
            box[1] <= startPoint[1] && startPoint[1] <= box[3]),
        endPointWithinBound = (
            box[0] <= endPoint[0] && endPoint[0] <= box[2] &&
            box[1] <= endPoint[1] && endPoint[1] <= box[3]),

        wantMinRoot = startPointWithinBound,
        wantMinRootIntoBox = !wantMinRoot && endPointWithinBound,
        wantMaxRoot = !wantMinRoot && !wantMinRootIntoBox,
        root = null;

    // Loop over the four sides of the box to find the intersections of the
    // Bezier curve to the box.
    for (var m = 0; m < 4; ++m) {
        var k = m % 2, l = (k + 1) % 2, s = (m < 2 ? -1 : 1), bound = box[s + 1 + k];

        var x = startPoint[k],
            y = curve.controlPoint1[k],
            z = curve.controlPoint2[k],
            w = endPoint[k],

            a = (-x + 3 * (y - z) + w),
            b = 3 * (x - y - y + z),
            c = 3 * (-x + y),
            d = x - bound;

        // The startPoint is fixed so we only need to decide where to move the endPoint.
        // Nothing can be done if the Bezier curve is a constant polynomial for this
        // coordinate.  Otherwise determine the roots of the cubic polynomial in the Bezier
        // curve to try to move the endPoint onto the boundary (so that the curve lies within
        // the boundary).
        var aIsZero = (Math.abs(a) < epsilon),
            bIsZero = (Math.abs(b) < epsilon),
            cIsZero = (Math.abs(c) < epsilon);
        if (!(aIsZero && bIsZero && cIsZero)) {
            var roots;
            if (aIsZero && bIsZero) {
                // Linear case:  c * x + d = 0
                roots = [-d / c];
            } else if (aIsZero) {
                // Quadratic case:  b * x^2 + c * x + d = 0
                var discriminant = (c * c - 4 * b * d);
                if (discriminant < 0) {
                    roots = [];
                } else if (discriminant > 0) {
                    var sqrtDiscriminant = Math.sqrt(discriminant);
                    roots = [(-c + sqrtDiscriminant) / (2 * b), (-c - sqrtDiscriminant) / (2 * b)];
                } else {
                    roots = [-c / (2 * b)];
                }
            } else {
                // Cubic polynomial case:  a * x^3 + b * x^2 + c * x + d = 0
                // See:  http://en.wikipedia.org/wiki/Cubic_function

                // Precompute powers of a and b
                var a2 = a * a, a3 = a * a2,
                    b2 = b * b, b3 = b * b2,

                    // Substitute t = x + b / (3 * a) to get t^3 + p * t + q = 0
                    avgRoot = -b / (3 * a),
                    p = (3 * a * c - b2) / (3 * a2),
                    q = (2 * b3 - 9 * a * b * c + 27 * a2 * d) / (27 * a3),
                    discriminant = (q * q / 4 + p * p * p / 27);

                if (discriminant > 0) {
                    // one real root
                    var sqrtDiscriminant = Math.sqrt(discriminant),
                        u3 = (-q / 2 + sqrtDiscriminant),
                        v3 = (-q / 2 - sqrtDiscriminant),
                        // Math.pow() may return NaN if the base is negative,
                        // so take the absolute value of the base and multiply
                        // by the sign.
                        u = (u3 > 0 ? 1 : -1) * Math.pow(Math.abs(u3), 1 / 3),
                        v = (v3 > 0 ? 1 : -1) * Math.pow(Math.abs(v3), 1 / 3);
                        roots = [u + v + avgRoot];
                } else {
                    // three real roots
                    var r = Math.sqrt(-4 * p / 3),
                        cos3Alpha = -4 * q / (r * r * r),
                        // Limit to [-1, 1] to avoid:  Math.acos(1.000000001) = NaN
                        alpha = Math.acos(Math.max(-1, Math.min(1, cos3Alpha))) / 3;
                    roots = [
                        avgRoot + r * Math.cos(alpha),
                        avgRoot + r * Math.cos(alpha + 2 * Math.PI / 3),
                        avgRoot + r * Math.cos(alpha - 2 * Math.PI / 3)];
                }
            }

            for (var i = roots.length; i--; ) {
                var r = roots[i],
                    firstDerivative = 3 * a * r * r + 2 * b * r + c;

                // The root must be in the interval [0, 1] to lie on the Bezier curve.  The
                // root must not be a (local) minimum/maximum so that the curve crosses from
                // one side of the bound to the other.
                if (epsilon < r && r < 1 - epsilon && firstDerivative != 0) {
                    var mn1 = (m + 3) % 4,
                        mp1 = (m + 1) % 4,
                        sn1 = (mn1 < 2 ? -1 : 1),
                        sp1 = (mp1 < 2 ? -1 : 1),
                        kn1 = l,
                        kp1 = l,
                        boundn1 = box[sn1 + 1 + kn1],
                        boundp1 = box[sp1 + 1 + kp1],
                        coord = isc.DrawPane.bezier(
                            startPoint[l], curve.controlPoint1[l],
                            curve.controlPoint2[l], endPoint[l],
                            r);

                    if (!(sn1 * coord > sn1 * boundn1) &&
                        !(sp1 * coord > sp1 * boundp1) &&
                        (wantMinRootIntoBox ?
                            (s == (firstDerivative > 0 ? -1 : 1) && (root == null || r < root)) :
                            (root == null || (wantMinRoot ? (r < root) : (r > root)))))
                    {
                        root = r;
                    }
                }
            }
        }
    }

    // If a suitable root is found then move the endPoint, and trim the curve to the subcurve
    // between the startPoint and the new endPoint.
    if (root != null) {
        this._decasteljau(curve, root, true);
    }

    // Flip the curve back.
    if (backward) {
        this._backward(curve);
    }
},

// Swaps curve.{start,end}Point and swaps curve.controlPoint{1,2}.
_backward : function (curve) {
    var swap = curve.startPoint;
    curve.startPoint = curve.endPoint;
    curve.endPoint = swap;

    swap = curve.controlPoint1;
    curve.controlPoint1 = curve.controlPoint2;
    curve.controlPoint2 = swap;
},


_decasteljau : function (curve, t, which) {


    var w = 1 - t;
    for (var k = 0; k < 2; ++k) {
        // Note that this is the same formula as in isc.DrawPane.bezier():
        var a = w * curve.startPoint[k] + t * curve.controlPoint1[k],
            b = w * curve.controlPoint1[k] + t * curve.controlPoint2[k],
            c = w * curve.controlPoint2[k] + t * curve.endPoint[k],
            d = w * a + t * b,
            e = w * b + t * c,
            f = w * d + t * e;

        if (which) {
            curve.controlPoint1[k] = a;
            curve.controlPoint2[k] = d;
            curve.endPoint[k] = f;
        } else {
            curve.startPoint[k] = f;
            curve.controlPoint1[k] = e;
            curve.controlPoint2[k] = c;
        }
    }
    return curve;
},

hideStartPointKnobs : function () {
    if (this._startKnob) {
        this._startKnob.destroy();
        delete this._startKnob;
    }
},

showEndPointKnobs : function () {
    if (this._endKnob != null && !this._endKnob.destroyed) return;

    this._endKnob = this.createAutoChild("endKnob", {
        _constructor: "DrawKnob",
        x: this.endPoint[0],
        y: this.endPoint[1],
        drawPane: this.drawPane,
        _targetShape: this,

        updatePoints : function (x, y, dx, dy, state) {
            var drawItem = this._targetShape;

            if (state == "start") {
                drawItem._dragEndPointControlPoint1 = drawItem.controlPoint1.duplicate();
                drawItem._dragEndPointControlPoint2 = drawItem.controlPoint2.duplicate();
            }
            var controlPoint1 = drawItem._dragEndPointControlPoint1,
                controlPoint2 = drawItem._dragEndPointControlPoint2;

            if (drawItem.keepInParentRect) {
                var box = drawItem._getParentRect(),
                    curve = {
                        startPoint: drawItem.startPoint,
                        controlPoint1: controlPoint1.duplicate(),
                        controlPoint2: controlPoint2.duplicate(),
                        endPoint: [x, y]
                    };

                drawItem._intersectCurveBox(curve.startPoint, curve, box);

                var newEndPoint = curve.endPoint,
                    newControlPoint2 = curve.controlPoint2,
                    newControlPoint1 = curve.controlPoint1;

                drawItem.setEndPoint(newEndPoint[0], newEndPoint[1]);
                if (drawItem.controlPoint2[0] != newControlPoint2[0] ||
                    drawItem.controlPoint2[1] != newControlPoint2[1])
                {
                    drawItem.setControlPoint2(newControlPoint2[0], newControlPoint2[1]);
                }
                if (drawItem.controlPoint1[0] != newControlPoint1[0] ||
                    drawItem.controlPoint1[1] != newControlPoint1[1])
                {
                    drawItem.setControlPoint1(newControlPoint1[0], newControlPoint1[1]);
                }
            } else {
                drawItem.setEndPoint(x, y);
            }

            if (state == "stop") {
                delete drawItem._dragEndPointControlPoint1,
                delete drawItem._dragEndPointControlPoint2;
            }
        }
    });
},

hideEndPointKnobs : function () {
    if (this._endKnob) {
        this._endKnob.destroy();
        delete this._endKnob;
    }
},

//> @attr drawCurve.c1Knob (AutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"controlPoint1"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#CONTROLPOINT1}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawKnob} for control point 1 of current drawCurve.
//
// @visibility drawing
//<
c1KnobDefaults: {
    cursor: "move",
    knobShapeProperties: {
        fillColor: "#0000ff"
    }
},

c1KnobConstructor: "DrawKnob",

// Control point knobs - these include a line going back to the start or end point
showControlPoint1Knobs : function () {
    if (this._c1Knob == null || this._c1Knob.destroyed) {
        this._c1Knob = this.createAutoChild("c1Knob", {
            x: this.controlPoint1[0],
            y: this.controlPoint1[1],
            drawPane: this.drawPane,
            _targetShape: this,

            updatePoints : function (x, y, dx, dy, state) {
                var drawItem = this._targetShape;
                if (state == "start") {
                    drawItem._dragControlPoint1StartPoint = drawItem.startPoint.duplicate();
                    drawItem._dragControlPoint1ControlPoint2 = drawItem.controlPoint2.duplicate();
                    drawItem._dragControlPoint1EndPoint = drawItem.endPoint.duplicate();
                }
                var startPoint = drawItem._dragControlPoint1StartPoint,
                    controlPoint2 = drawItem._dragControlPoint1ControlPoint2,
                    endPoint = drawItem._dragControlPoint1EndPoint;

                if (drawItem.keepInParentRect) {
                    var box = drawItem._getParentRect(),
                        curve = {
                            startPoint: startPoint.duplicate(),
                            controlPoint1: [x, y],
                            controlPoint2: controlPoint2.duplicate(),
                            endPoint: endPoint.duplicate()
                        };

                    drawItem._intersectCurveBox(curve.endPoint, curve, box);

                    var newStartPoint = curve.startPoint,
                        newControlPoint1 = curve.controlPoint1,
                        newControlPoint2 = curve.controlPoint2;

                    drawItem.setControlPoint1(newControlPoint1[0], newControlPoint1[1]);
                    if (newStartPoint[0] != drawItem.startPoint[0] ||
                        newStartPoint[1] != drawItem.startPoint[1])
                    {
                        drawItem.setStartPoint(newStartPoint[0], newStartPoint[1]);
                    }
                    if (newControlPoint2[0] != drawItem.controlPoint2[0] ||
                        newControlPoint2[1] !== drawItem.controlPoint2[1])
                    {
                        drawItem.setControlPoint2(newControlPoint2[0], newControlPoint2[1]);
                    }
                } else {
                    drawItem.setControlPoint1(x, y);
                }

                if (state == "stop") {
                    delete drawItem._dragControlPoint1StartPoint;
                    delete drawItem._dragControlPoint1ControlPoint2;
                    delete drawItem._dragControlPoint1EndPoint;
                }
            }
        });
    }

    if (this._c1Line == null || this._c1Line.destroyed) {
        this._c1Line = this.createAutoChild("c1Line", {
            _constructor: "DrawLine",
            startLeft: this.startPoint[0], startTop: this.startPoint[1],
            endLeft: this.controlPoint1[0], endTop: this.controlPoint1[1],
            drawPane: this.drawPane,
            autoDraw: true
        });
    }
},

hideControlPoint1Knobs : function () {
    if (this._c1Knob) {
        this._c1Knob.destroy();
        delete this._c1Knob;
    }
    if (this._c1Line) {
        this._c1Line.erase();
        delete this._c1Line;
    }
},

//> @attr drawCurve.c2Knob (AutoChild DrawKnob : null : IR)
// If this item is showing <smartclient>"controlPoint2"</smartclient>
// <smartgwt>{@link com.smartgwt.client.types.KnobType#CONTROLPOINT2}</smartgwt>
// +link{drawItem.knobs,control knobs}, this attribute specifies the AutoChild for the
// +link{DrawKnob} for control point 2 of current drawCurve.
//
// @visibility drawing
//<
c2KnobDefaults: {
    cursor: "move",
    knobShapeProperties: {
        fillColor: "#0000ff"
    }
},

c2KnobConstructor: "DrawKnob",

showControlPoint2Knobs : function () {
    if (this._c2Knob == null || this._c2Knob.destroyed) {
        this._c2Knob = this.createAutoChild("c2Knob", {
            x: this.controlPoint2[0],
            y: this.controlPoint2[1],
            drawPane: this.drawPane,
            _targetShape: this,

            updatePoints : function (x, y, dx, dy, state) {
                var drawItem = this._targetShape;
                if (state == "start") {
                    drawItem._dragControlPoint2StartPoint = drawItem.startPoint.duplicate();
                    drawItem._dragControlPoint2ControlPoint1 = drawItem.controlPoint1.duplicate();
                    drawItem._dragControlPoint2EndPoint = drawItem.endPoint.duplicate();
                }
                var startPoint = drawItem._dragControlPoint2StartPoint,
                    controlPoint1 = drawItem._dragControlPoint2ControlPoint1,
                    endPoint = drawItem._dragControlPoint2EndPoint;

                if (drawItem.keepInParentRect) {
                    var box = drawItem._getParentRect(),
                        curve = {
                            startPoint: startPoint.duplicate(),
                            controlPoint1: controlPoint1.duplicate(),
                            controlPoint2: [x, y],
                            endPoint: endPoint.duplicate()
                        };

                    drawItem._intersectCurveBox(curve.startPoint, curve, box);

                    var newControlPoint1 = curve.controlPoint1,
                        newControlPoint2 = curve.controlPoint2,
                        newEndPoint = curve.endPoint;

                    drawItem.setControlPoint2(newControlPoint2[0], newControlPoint2[1]);
                    if (newControlPoint1[0] != drawItem.controlPoint1[0] ||
                        newControlPoint1[1] != drawItem.controlPoint1[1])
                    {
                        drawItem.setControlPoint1(newControlPoint1[0], newControlPoint1[1]);
                    }
                    if (newEndPoint[0] != drawItem.endPoint[0] ||
                        newEndPoint[1] != drawItem.endPoint[1])
                    {
                        drawItem.setEndPoint(newEndPoint[0], newEndPoint[1]);
                    }
                } else {
                    drawItem.setControlPoint2(x, y);
                }

                if (state == "stop") {
                    delete drawItem._dragControlPoint2StartPoint;
                    delete drawItem._dragControlPoint2ControlPoint1;
                    delete drawItem._dragControlPoint2EndPoint;
                }
            }
        });
    }

    if (this._c2Line == null || this._c2Line.destroyed) {
        this._c2Line = this.createAutoChild("c2Line", {
            _constructor: "DrawLine",
            startLeft: this.endPoint[0], startTop: this.endPoint[1],
            endLeft: this.controlPoint2[0], endTop: this.controlPoint2[1],
            drawPane: this.drawPane,
            autoDraw: true
        });
    }
},

hideControlPoint2Knobs : function () {
    if (this._c2Knob) {
        this._c2Knob.destroy();
        delete this._c2Knob;
    }
    if (this._c2Line) {
        this._c2Line.erase();
        delete this._c2Line;
    }
},

updateControlKnobs : function () {
    // update the position of our start/end point knobs when we update our other control points
    this.Super("updateControlKnobs", arguments);
    if (this._startKnob || this._c1Line) {
        var left = this.startPoint[0],
            top = this.startPoint[1];

        // If we're showing the control line, update its start point
        if (this._c1Line) this._c1Line.setStartPoint(left,top);

        // startKnob is a canvas - hence drawing2Screen
        if (this._startKnob) {
            var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._startKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }

    }
    if (this._endKnob || this._c2Line) {
        var left = this.endPoint[0],
            top = this.endPoint[1];
        if (this._c2Line) this._c2Line.setStartPoint(left,top);
        if (this._endKnob) {
            var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._endKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    }

    if (this._c1Knob) {
        var left = this.controlPoint1[0], top = this.controlPoint1[1];
        // we always render c1Line with c1Point
        this._c1Line.setEndPoint(left,top);

        var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
        this._c1Knob.setCenterPoint(screenCoords[0], screenCoords[1]);
    }

    if (this._c2Knob) {
        var left = this.controlPoint2[0], top = this.controlPoint2[1];

        this._c2Line.setEndPoint(left,top);

        var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
        this._c2Knob.setCenterPoint(screenCoords[0], screenCoords[1]);
    }
},

//> @method drawCurve.moveTo()
// Sets start, end and control points of this curve
//
// @param x (int) new x coordinate in pixels
// @param y (int) new y coordinate in pixels
// @visibility drawing
//<
moveTo : function (x, y) {
  this.moveBy(x-this.startPoint[0],y-this.startPoint[1]);
},

//> @method drawCurve.moveBy()
// Increment start, end and control points of this curve
//
// @param x (int) new x coordinate in pixels
// @param y (int) new y coordinate in pixels
// @visibility drawing
//<
moveBy : function (x, y) {
    this.startPoint[0] += x;
    this.startPoint[1] += y;
    this.controlPoint1[0] += x;
    this.controlPoint1[1] += y;
    this.controlPoint2[0] += x;
    this.controlPoint2[1] += y;
    this.endPoint[0] += x;
    this.endPoint[1] += y;
    if (!isc.Browser._supportsCanvasIsPointInStroke) {
        this._calculateOffsetCurvePath();
    }

    if (this.drawingVML) {

        var vmlHandle = this._getVMLHandle();
        vmlHandle.from = this.startPoint[0] + " " + this.startPoint[1];
        vmlHandle.to = this.endPoint[0] + " " + this.endPoint[1];
        vmlHandle.control1 = this.controlPoint1[0] + " " + this.controlPoint1[1];
        vmlHandle.control2 = this.controlPoint2[0] + " " + this.controlPoint2[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this.Super("moveBy", arguments);
}

}); // end DrawCurve.addProperties








//------------------------------------------------------------------------------------------
//> @class DrawBlockConnector
//
// DrawItem subclass to render multi-segment, orthogonal-routing paths.
//
// @inheritsFrom DrawCurve
// @treeLocation Client Reference/Drawing/DrawItem
// @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawBlockConnector", "DrawCurve").addProperties({

    svgElementName: "path",
    vmlElementName: "curve",

//----------------------------------------
//  DrawBlockConnector renderers
//----------------------------------------

getAttributesVML : function () {
    return  "FROM='" + this.startPoint[0] + " " + this.startPoint[1] +
            "' TO='" + this.endPoint[0] + " " + this.endPoint[1] +
            "' CONTROL1='" + this.controlPoint1[0] + " " + this.controlPoint1[1] +
            "' CONTROL2='" + this.controlPoint2[0] + " " + this.controlPoint2[1] +
            "'"
},

getAttributesSVG : function () {
    return  "d='" + this.getPathSVG() + "'"
},

//----------------------------------------
//  DrawBlockConnector attribute setters
//----------------------------------------

setStartPoint : function (left, top) {
    if (isc.isAn.Array(left)) {
        top = left[1];
        left = left[0];
    }

    if (left != null) this.startPoint[0] = left;
    if (top != null) this.startPoint[1] = top;
    if (this.drawingVML) {
        this._getVMLHandle().from = this.startPoint[0] + " " + this.startPoint[1];
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
}

}) // end DrawBlockConnector.addProperties








//------------------------------------------------------------------------------------------
//> @class DrawPath
//
// Draws a multi-segment line.
//
// @inheritsFrom DrawItem
// @treeLocation Client Reference/Drawing/DrawItem
// @visibility drawing
//<
//------------------------------------------------------------------------------------------
isc.defineClass("DrawPath", "DrawItem").addProperties({
    //> @attr drawPath.knobs
    // DrawPath only supports the
    // <smartclient>"move"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
    // knob type.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    //> @attr drawPath.points (Array of Point : [[0,0], [100,100]] : IRW)
    // Array of Points for the line.
    // @visibility drawing
    //<
    points: [[0,0], [100,100]],

    svgElementName: "polyline",
    vmlElementName: "POLYLINE",

init : function () {
    this.Super("init", arguments);
    this.setPoints(isc.clone(this.points))
},

//> @method drawPath.getBoundingBox()
// Returns the min, max points
// @return (array) x1, y1, x2, y2 coordinates
// @visibility drawing
//<
getBoundingBox : function (includeStroke, outputBox) {

    var bbox = (outputBox || new Array(4)),
        points = this.points,
        point = points[0];
    if (point == null) {
        for (var i = 4; i--; ) {
            bbox[i] = this._boundingBox[i];
        }
        return bbox;
    }

    var minX = point[0],
        minY = point[1],
        maxX = point[0],
        maxY = point[1];
    for (var i = 1, len = points.length; i < len; ++i) {
        point = points[i];
        minX = Math.min(minX, point[0]);
        minY = Math.min(minY, point[1]);
        maxX = Math.max(maxX, point[0]);
        maxY = Math.max(maxY, point[1]);
    }

    bbox[0] = minX;
    bbox[1] = minY;
    bbox[2] = maxX;
    bbox[3] = maxY;
    return includeStroke != true ? bbox : this._adjustBoundingBoxForStroke(bbox);
},

//----------------------------------------
//  DrawPath renderers
//----------------------------------------

getPathSVG : function () {
    var path = "M ", i, point = this.points[0];
    path += point[0] + " " + point[1] + " ";
    for (i = 1; i < this.points.length; ++i) {
        point = this.points[i];
        path += " L " + point[0] + " " + point[1];
    }
    return path;
},

getAttributesSVG : function () {
    var pointsText = this.getPointsText();
    return "points='" + pointsText + "'";
},

// get the list of points as a series of integers like "0 0 100 100" (representing the points
// [0,0] and [100,100], which is what VML and SVG want for a series of points
getPointsText : function () {
    var output = isc.SB.create(),
        points = this.points;
    for (var i = 0; i < points.length; i++) {
        output.append(points[i][0], " ", points[i][1]);
        if (i < points.length - 1) output.append(" ");
    }
    return output.toString();
},

getAttributesVML : function () {
    return isc.SB.concat(
        "STYLE='position:absolute; left:", this.left,
            "px; top:", this.top,
            "px; width:", this.width,
            "px; height:", this.height, "px;'",
            " POINTS='" + this.getPointsText() + "'");
//    return  "POINTS='" + this.getPointsText() + "'"
},


drawBitmapPath : function (context) {
    var points = this.points, angle, arrowDelta = 10, lastPoint = points.length-1, originX, originY;
    if (this.startArrow == "open") {
        context.save();
        context.beginPath();
        context.strokeStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(points[0][0],points[0][1],points[1][0],points[1][1]);
        originX = points[0][0];
        originY = points[0][1];
        context.scale(1,1);
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(arrowDelta,-arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(arrowDelta,arrowDelta, context);
        context.stroke();
        context.restore();
    } else if (this.startArrow == "block") {
        context.save();
        context.beginPath();
        context.fillStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(points[0][0],points[0][1],points[1][0],points[1][1]);
        originX = points[0][0];
        originY = points[0][1];
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(arrowDelta,-arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(arrowDelta,arrowDelta, context);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
    if (this.endArrow == "open") {
        context.save();
        context.beginPath();
        context.strokeStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(points[lastPoint-1][0],points[lastPoint-1][1],points[lastPoint][0],points[lastPoint][1]);
        originX = points[lastPoint][0];
        originY = points[lastPoint][1];
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(-arrowDelta,arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(-arrowDelta,-arrowDelta, context);
        context.stroke();
        context.restore();
    } else if (this.endArrow == "block") {
        context.save();
        context.beginPath();
        context.fillStyle = this.lineColor;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        angle = this.computeAngle(points[lastPoint-1][0],points[lastPoint-1][1],points[lastPoint][0],points[lastPoint][1]);
        originX = points[lastPoint][0];
        originY = points[lastPoint][1];
        context.translate(originX, originY);
        context.rotate(angle*this._radPerDeg);
        this.bmMoveTo(-arrowDelta,arrowDelta, context);
        this.bmLineTo(0,0, context);
        this.bmLineTo(-arrowDelta,-arrowDelta, context);
        context.closePath();
        context.fill();
        context.restore();
    }
    this.bmMoveTo(points[0][0], points[0][1], context);
    for (var i = 1; i < points.length; i++) {
        var point = points[i];
        if(this.linePattern.toLowerCase() !== "solid") {
            this._drawLinePattern(points[i-1][0],points[i-1][1],points[i][0],points[i][1],context);
        } else {
            this.bmLineTo(point[0], point[1], context);
        }
    }
},

//> @method drawPath.getCenter()
// Get the mean center of the path.
// @return (Point) the mean center
// @visibility drawing
//<
getCenter : function () {
    var point, i, x = 0, y = 0, length = this.points.length;
    for (i = 0; i < length; ++i) {
        point = this.points[i];
        x += point[0];
        y += point[1];
    }
    x = Math.round(x/length);
    y = Math.round(y/length);
    return [x,y];
},

//----------------------------------------
//  DrawPath attribute setters
//----------------------------------------
setPoints : function (points) {
    this.points = points;
    this._initBoundingParams();
    if (this.drawingVML) {
        this._getVMLHandle().points.value = this.getPointsText();
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }

    this._reshaped();
},

//sets correct values for left, top, width, height based on poins values
_initBoundingParams : function () {
    var bb = this.getBoundingBox(false, this._tempBoundingBox);
    this.left = bb[0];
    this.top = bb[1];
    this.width = bb[2] - bb[0];
    this.height = bb[3] - bb[1];
},

//> @method drawPath.moveTo(left,top)
// Move both the start and end points of the line, such that the startPoint ends up at the
// specified coordinate and the line length and angle are unchanged.
//
// @param left (int) new startLeft coordinate in pixels
// @param top (int) new startTop coordinate in pixels
// @visibility drawing
//<
moveTo : function (x, y) {
    var dX = x - this.points[0][0];
    var dY = y - this.points[0][1];
    this.moveBy(dX,dY);
},
//> @method drawPath.moveBy(dX,dY)
// Move the points by dX,dY
//
// @param dX (int) delta x coordinate in pixels
// @param dY (int) delta y coordinate in pixels
// @visibility drawing
//<
moveBy : function (dX, dY) {
    if(this.getClass().getClassName() !== 'DrawLinePath') {
        var point, length = this.points.length;
        for (var i = 0; i < length; ++i) {
            point = this.points[i];
            point[0] += dX;
            point[1] += dY;
        }
        if (this.drawingVML) {
            this._getVMLHandle().points.value = this.getPointsText();
        } else if (this.drawingSVG) {
            this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
        } else if (this.drawingBitmap) {
            this.drawPane.redrawBitmap();
        }
    }
    this.Super("moveBy", arguments);
},

//> @method drawPath.resizeTo()
// Resize to the specified size
// @param width (int) new width
// @param height (int) new height
// @visibility drawing
//<
resizeTo : function (width,height) {
    var dX = 0, dY = 0;
    if (width != null) dX = width - this.width;
    if (height != null) dY = height - this.height;

    this.resizeBy(dX,dY);
},

//> @method drawPath.resizeBy()
// Resize by the specified delta
// @param dX (int) number of pixels to resize by horizontally
// @param dY (int) number of pixels to resize by vertically
// @visibility drawing
//<
resizeBy : function (dX, dY) {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    var widthMultiplier = 1 + dX / (bbox[2] - bbox[0]);
    var heightMultiplier = 1 + dY / (bbox[3] - bbox[1]);
    var length = this.points.length;
    for (var i = 0; i < length; ++i) {
        var point = this.points[i];
        // Do not allow the path to collapse to a line or a point.
        if (widthMultiplier != 0) point[0] = bbox[0] + ((point[0] - bbox[0]) * widthMultiplier);
        if (heightMultiplier != 0) point[1] = bbox[1] + ((point[1] - bbox[1]) * heightMultiplier);
    }

    this.setPoints(this.points);
    this.Super("resizeBy", arguments);
}

});








//> @class DrawPolygon
//
// DrawItem subclass to render polygons
//
// @inheritsFrom DrawPath
// @treeLocation Client Reference/Drawing/DrawItem
// @visibility drawing
//<
isc.defineClass("DrawPolygon", "DrawPath").addProperties({

    //> @attr drawPolygon.knobs
    // DrawPolygon only supports the
    // <smartclient>"move"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#MOVE}</smartgwt>
    // knob type.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    //> @attr drawPolygon.points (Array of Point : [[0,0], [50,50], [100,0]] : IRW)
    // Array of points of the polygon.
    // @visibility drawing
    //<
    points: [[0,0], [50,50], [100,0]],

    //> @attr drawPolygon.lineCap     (LineCap : "butt" : IRW)
    // Style of drawing the corners of the polygon.
    //
    // @group line
    // @visibility drawing
    //<
    lineCap: "butt",

    svgElementName: "path",
    vmlElementName: "POLYLINE"
});
isc.DrawPolygon.addMethods({

init : function () {
    this.Super("init");
    this.points = isc.clone(this.points);
},

getPointsText : function () {
    var output = isc.SB.create(),
        points = this.points;
    for (var i = 0; i < points.length; i++) {
        output.append(points[i][0], " ", points[i][1], " ");
    }
    output.append(points[0][0], " ", points[0][1]);
    return output.toString();
},

getPathSVG : function () {
    return this.Super("getPathSVG", arguments) + " Z";
},

getAttributesSVG : function () {
    return "d='" + this.getPathSVG() + "'";
},

//----------------------------------------
//  DrawPath attribute setters
//----------------------------------------
setPoints : function (points) {
    this.points = points;
    this._initBoundingParams();
    if (this.drawingVML) {
        this._getVMLHandle().points.value = this.getPointsText();
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this.getPathSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
},

//sets correct values for left, top, width, height based on poins values
_initBoundingParams : function () {
    var bb = this.getBoundingBox(false, this._tempBoundingBox);
    this.left = bb[0];
    this.top = bb[1];
    this.width = bb[2] - bb[0];
    this.height = bb[3] - bb[1];
},

drawBitmapPath : function (context) {
    var points = this.points;
    this.bmMoveTo(points[0][0], points[0][1], context);
    for (var i = 1; i < points.length; i++) {
        var point = points[i];
        this.bmLineTo(point[0], point[1], context);
    }
    context.closePath();
}

});

isc.DrawPolygon.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//> @class DrawTriangle
//
//  DrawItem subclass to render triangles
//
//  @inheritsFrom DrawPolygon
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawTriangle", "DrawPolygon");

//> @attr drawTriangle.points
// Array of points of the triangle.
// @include DrawPolygon.points
//<

isc.DrawTriangle.addMethods({

//> @method drawTriangle.getCenter()
// Get the +externalLink{http://en.wikipedia.org/wiki/Incenter#Coordinates_of_the_incenter,incenter}
// of the triangle.
// @return (Point) the incenter
// @visibility drawing
//<
getCenter : function () {
    // Compute the Cartesian coordinates of the triangle's incenter using the formula listed at
    // http://en.wikipedia.org/wiki/Incenter#Coordinates_of_the_incenter
    // Then figure out where the incenter is as a percentage of the bounding box width and
    // height.
    var a = isc.Math.euclideanDistance(this.points[1], this.points[2]),
        b = isc.Math.euclideanDistance(this.points[0], this.points[2]),
        c = isc.Math.euclideanDistance(this.points[0], this.points[1]),
        P = a + b + c,
        u = [a, b, c],
        vx = [this.points[0][0], this.points[1][0], this.points[2][0]],
        vy = [this.points[0][1], this.points[1][1], this.points[2][1]],
        incenter = [isc.Math._dot(u, vx) / P, isc.Math._dot(u, vy) / P];

    return incenter;
},

//> @method drawTriangle.resizeBy()
// Resize by the specified delta
// @param dX (int) number of pixels to resize by horizontally
// @param dY (int) number of pixels to resize by vertically
// @visibility drawing
//<
resizeBy : function (dX, dY) {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    var widthMultiplier = 1 + dX / (bbox[2] - bbox[0]);
    var heightMultiplier = 1 + dY / (bbox[3] - bbox[1]);
    var length = this.points.length;
    for (var i = 0; i < length; ++i) {
        var point = this.points[i];
        // Do not allow the path to collapse to a line or a point.
        if (widthMultiplier != 0) point[0] = bbox[0] + ((point[0] - bbox[0]) * widthMultiplier);
        if (heightMultiplier != 0) point[1] = bbox[1] + ((point[1] - bbox[1]) * heightMultiplier);
    }

    this.setPoints(this.points);
    this.Super("resizeBy", arguments);
}

});








//------------------------------------------------------------------------------------------
//> @class DrawLinePath
//
//  DrawItem subclass to render a connector between two points. If the points are aligned
//  on one axis, this connector will draw as a straight line. If the points are offset on
//  both axes and there is enough space, the connector will by default draw short horizontal
//  segments from the start and end points, and a diagonal segment connecting the ends of these
//  'tail' segments.  Connector style and orientation defaults may be changed through
//  configuration.
//
//  @inheritsFrom DrawItem
//  @treeLocation Client Reference/Drawing/DrawItem
//  @visibility drawing
//<
//------------------------------------------------------------------------------------------

isc.defineClass("DrawLinePath", "DrawPath").addProperties({

    //> @attr drawLinePath.connectorStyle     (ConnectorStyle : "diagonal" : IR)
    // The ConnectorStyle controlling the presentation and behavior of this line's
    // tail segments.
    //
    // @group line
    // @visibility drawing
    //<
    connectorStyle: "diagonal",

    //> @type ConnectorStyle
    // Supported styles of connector styles.
    // @value "diagonal" Center segment is drawn diagonally between tail connector segments
    // @value "rightAngle" Center segment is drawn perpendicular to tail connector segments
    // @group line
    // @visibility drawing
    //<

    //> @attr drawLinePath.connectorOrientation     (ConnectorOrientation : "auto" : IR)
    // The ConnectorOrientation controlling the orientation and behavior of this line's
    // tail segments.
    //
    // @group line
    // @visibility drawing
    //<
    connectorOrientation: "auto",

    //> @type ConnectorOrientation
    // Supported styles of connector orientations.
    // @value "horizontal" Tail segments are always horizontal; best for left-to-right connectors
    // @value "vertical"  Tail segments are always vertical; best for top-to-bottom connectors
    // @value "auto" Tail segments flip orientation according to longer axis of bounding box: if the
    //               bounding box is wider than it is tall, center segment is vertical
    // @group line
    // @visibility drawing
    //<

    //> @attr drawLinePath.knobs
    // Array of control knobs to display for this item. Each +link{knobType} specified in this
    // will turn on UI element(s) allowing the user to manipulate this DrawLinePath.  To update the
    // set of knobs at runtime use +link{drawItem.showKnobs()} and +link{drawItem.hideKnobs()}.
    // <p>
    // DrawLinePath supports the
    // <smartclient>"startPoint", "endPoint", "controlPoint1", and "controlPoint2"</smartclient>
    // <smartgwt>{@link com.smartgwt.client.types.KnobType#STARTPOINT}, {@link com.smartgwt.client.types.KnobType#ENDPOINT}, {@link com.smartgwt.client.types.KnobType#CONTROLPOINT1}, and {@link com.smartgwt.client.types.KnobType#CONTROLPOINT2}</smartgwt>
    // knob types.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    //> @attr drawLinePath.startPoint (Point : [0,0] : IRW)
    // @include drawLine.startPoint
    //<
    startPoint: [0,0],

    //> @attr drawLinePath.endPoint (Point : [100,100] : IRW)
    // @include drawLine.endPoint
    //<
    endPoint: [100,100],

    //> @attr drawLinePath.controlPoint1 (Point: null : IRW)
    // The point at which the leading tail segment joins the connecting center segment.
    // @visibility drawing
    //<
    controlPoint1: null,

    //> @attr drawLinePath.controlPoint2 (Point: null : IRW)
    // The point at which the trailing tail segment joins the connecting center segment.
    // Has no effect on lines with right angle ConnectorStyles.
    // @visibility drawing
    //<
    controlPoint2: null,

    //> @attr drawLinePath.tailSize (int : 30 : IR)
    // Length of the horizontal/vertical "tail segments" between the start and end points of
    // this DrawLinePath and the connecting center segment.
    // @visibility drawing
    //<
    tailSize: 30,

    //> @attr drawLinePath.startLeft (int : 0 , IRW)
    // @include drawLine.startLeft
    //<
    //> @attr drawLinePath.startTop (int : 0 , IRW)
    // @include drawLine.startTop
    //<

    //> @attr drawLinePath.endLeft (int : 0 , IRW)
    // @include drawLine.endLeft
    //<

    //> @attr drawLinePath.endTop (int : 0 , IRW)
    // @include drawLine.endTop
    //<

    startArrow:null,

    //> @attr drawLinePath.endArrow (ArrowStyle : "open", IRW)
    // @include drawItem.endArrow
    //<
    endArrow:"open",

    init : function () {
        this.startPoint = this.startPoint.duplicate();
        this.endPoint = this.endPoint.duplicate();
        this.startLeft = (this.startLeft == 0 ? 0 : (this.startLeft || this.startPoint[0]));
        this.startTop = (this.startTop == 0 ? 0 : (this.startTop || this.startPoint[1]));
        this.endLeft = (this.endLeft == 0 ? 0 : (this.endLeft || this.endPoint[0]));
        this.endTop = (this.endTop == 0 ? 0 : (this.endTop || this.endPoint[1]));

        // function will calculate control points if uninitalized
        this.points = this._getSegmentPoints(this.controlPoint1, this.controlPoint2);

        this.Super("init");
    },

    // Returns the direction in which the tail segments should be pointed, based on the
    // longest axis of the bounding box: if the bounding box is wider than it is tall,
    // tail segments should be horizontal.
    getConnectorOrientationState : function() {
        var width = Math.abs(this.endLeft - this.startLeft);
        var height = Math.abs(this.endTop - this.startTop);
        var orientation = this.connectorOrientation;
        if (orientation === "auto") {
            orientation = (width >= height ? "horizontal" : "vertical");
        }
        return orientation;
    },

    // Calculates a DrawLinePath's leading and/or trailing tail segments, if necessary,
    // to be represented by controlPoint1 / controlPoint2 knobs.
     _getSegmentPoints : function (leader, trailer) {

        //the end points
        var p1 = [this.startLeft, this.startTop];
        var p2 = [this.endLeft, this.endTop];

        var orientation = this.getConnectorOrientationState();
        var style = this.connectorStyle;

        //default tail length
        var tailSize = this.tailSize;

        // draw horizontal tail segments
        if (orientation === "horizontal") {

            // find the length of the leading tail segment and draw the tail segment at the same
            // point on the x axis, making a right angle
            if (style === "rightAngle") {

                if (this.controlPoint1 == null) {
                    tailSize = this.startLeft <= this.endLeft ? -this.tailSize : this.tailSize;
                } else {
                    tailSize = this.startLeft - this.controlPoint1[0];
                }

                leader = [this.startLeft - tailSize, this.startTop];
                trailer = [this.startLeft - tailSize, this.endTop];

            } else {

                if (this.startLeft <= this.endLeft) {
                    tailSize = -tailSize;
                }

                // don't change any point explicitly provided by the end user (as in move, etc)
                leader = leader || [this.startLeft - tailSize, this.startTop];
                trailer = trailer || [this.endLeft + tailSize, this.endTop];
           }
        }

        if (orientation === "vertical") {

            // find the length of the leading tail segment and draw the tail segment at the same
            // point on the y axis, making a right angle
            if (style === "rightAngle") {

                if (this.controlPoint1 == null) {
                    tailSize = this.startTop <= this.endTop ? -this.tailSize : this.tailSize;
                } else {
                    tailSize = this.startTop - this.controlPoint1[1];
                }

                leader = [this.startLeft, this.startTop - tailSize];
                trailer = [this.endLeft, this.startTop - tailSize];

            } else {

                if (this.startTop <= this.endTop) {
                    tailSize = -tailSize;
                }

                // don't change any point explicitly provided by the end user (as in move, etc)
                leader = leader || [this.startLeft, this.startTop - tailSize];
                trailer = trailer || [this.endLeft, this.endTop + tailSize];
            }
        }

        if (style === "rightAngle") {
            this.controlPoint1 = this.getCenter(leader, trailer);
        } else {
            this.controlPoint1 = leader;
            this.controlPoint2 = trailer;
        }

        this._segmentPoints = [p1, leader, trailer, p2];

        return this._segmentPoints;
    },

    _drawLineStartArrow : function () {
        return this.startArrow == "open"
    },

    _drawLineEndArrow : function () {
        return this.endArrow == "open"
    },

    //> @method drawLinePath.getCenter()
    // Get the center point of the line path.
    // @return (Point) the center point
    // @visibility drawing
    //<
    getCenter : function (p1, p2) {

        var startPoint = p1 || this.startPoint;
        var endPoint = p2 || this.endPoint;

        return [startPoint[0] + Math.round((endPoint[0] - startPoint[0])/2), startPoint[1] + Math.round((endPoint[1] - startPoint[1])/2)];
    },

    //----------------------------------------
    //  DrawLinePath attribute setters
    //----------------------------------------


    //> @method drawLinePath.setStartPoint()
    // @include drawLine.setStartPoint()
    //<
    setStartPoint : function (left, top) {
        if (isc.isAn.Array(left)) {
            top = left[1];
            left = left[0];
        }

        if (left != null) {
            this.startLeft = this.startPoint[0] = left;
        }
        if (top != null) {
            this.startTop = this.startPoint[1] = top;
        }

        // regenerate points

        this.setPoints(this._getSegmentPoints(null, this.controlPoint2));
    },

    //> @method drawLinePath.setEndPoint()
    // @include drawLine.setEndPoint()
    //<
    setEndPoint : function (left, top) {
        if (isc.isAn.Array(left)) {
            top = left[1];
            left = left[0];
        }

        if (left != null) {
            this.endLeft = this.endPoint[0] = left;
        }
        if (top != null) {
            this.endTop = this.endPoint[1] = top;
        }

        // regenerate points

        this.setPoints(this._getSegmentPoints(this.controlPoint1, null));
    },

    //> @method drawLinePath.setControlPoint1()
    // Sets the coordinates of the controlPoint1 knob and by extension the coordinates of this
    // DrawLinePath's leading tail segment.
    // @param left (int) left coordinate for start point, in pixels
    // @param top (int) top coordinate for start point, in pixels
    // @visibility drawing
    //<
    setControlPoint1 : function (left, top) {
        if (isc.isAn.Array(left)) {
            top = left[1];
            left = left[0];
        }

        if (left != null) {
            this.controlPoint1[0] = left;
        }
        if (top != null) {
            this.controlPoint1[1] = top;
        }

        // regenerate points so that the line gets dragged along with the knob
        this.setPoints(this._getSegmentPoints(this.controlPoint1, this.controlPoint2));
    },

    //> @method drawLinePath.setControlPoint2()
    // Sets the coordinates of the controlPoint2 knob and by extension the coordinates of this
    // DrawLinePath's trailing tail segment.
    // @param left (int) left coordinate for start point, in pixels
    // @param top (int) top coordinate for start point, in pixels
    // @visibility drawing
    //<
    setControlPoint2 : function (left, top) {
        if (isc.isAn.Array(left)) {
            top = left[1];
            left = left[0];
        }

        if (left != null) {
            this.controlPoint2[0] = left;
        }
        if (top != null) {
            this.controlPoint2[1] = top;
        }

        // regenerate points so that the line gets dragged along with the knob
        this.setPoints(this._getSegmentPoints(this.controlPoint1, this.controlPoint2));
    },



    //> @method drawLinePath.getBoundingBox()
    // Returns the startPoint, endPoint
    // @return (array) x1, y1, x2, y2 coordinates
    // @visibility drawing
    //<
    getBoundingBox : function (includeStroke, outputBox) {

        var x1 = this.startPoint[0],
            y1 = this.startPoint[1],
            x2 = this.endPoint[0],
            y2 = this.endPoint[1],
            bbox = (outputBox || new Array(4));
        bbox[0] = Math.min(x1, x2);
        bbox[1] = Math.min(y1, y2);
        bbox[2] = Math.max(x1, x2);
        bbox[3] = Math.max(y1, y2);
        return includeStroke != true ? bbox : this._adjustBoundingBoxForStroke(bbox);
    },

    showResizeKnobs : null,
    hideResizeKnobs : null,

    showMoveKnobs : null,
    hideMoveKnobs : null,

    // steal start/endpoint knobs functions from drawLine
    showStartPointKnobs : isc.DrawLine.getPrototype().showStartPointKnobs,
    hideStartPointKnobs : isc.DrawLine.getPrototype().hideStartPointKnobs,
    showEndPointKnobs : isc.DrawLine.getPrototype().showEndPointKnobs,
    hideEndPointKnobs : isc.DrawLine.getPrototype().hideEndPointKnobs,

    showControlPoint1Knobs : function() {

        if (this._c1Knob == null || this._c1Knob.destroyed) {
            this._c1Knob = this.createAutoChild("c1Knob", {
                _constructor: "DrawKnob",
                x: this.controlPoint1[0],
                y: this.controlPoint1[1],
                drawPane: this.drawPane,
                _targetShape: this,

                updatePoints : function (x, y, dx, dy, state) {
                    var creator = this.creator;
                    var drawItem = this._targetShape;
                    var orientation = creator.getConnectorOrientationState();

                    // restrict movement to the axis appropriate for a given orientation
                    if (orientation === "horizontal") {
                        y = y-dy;
                    } else {
                        x = x-dx;
                    }
                    drawItem.setControlPoint1(x, y);
                }
            });
        }
    },
    hideControlPoint1Knobs : function() {
        if (this._c1Knob) {
            this._c1Knob.destroy();
            delete this._c1Knob;
        }
    },

    showControlPoint2Knobs : function() {

        if (this.connectorStyle === "diagonal" && (this._c2Knob == null || this._c2Knob.destroyed)) {
            this._c2Knob = this.createAutoChild("c2Knob", {
                _constructor: "DrawKnob",
                x: this.controlPoint2[0],
                y: this.controlPoint2[1],
                drawPane: this.drawPane,
                _targetShape: this,

                updatePoints : function (x, y, dx, dy, state) {
                    var creator = this.creator;
                    var drawItem = this._targetShape;
                    var orientation = creator.getConnectorOrientationState();

                    // restrict movement to the axis appropriate for a given orientation
                    if (orientation === "horizontal") {
                        y = y-dy;
                    } else {
                        x = x-dx;
                    }
                    drawItem.setControlPoint2(x, y);
                }
            });
        }
    },
    hideControlPoint2Knobs : function() {
        if (this._c2Knob) {
            this._c2Knob.destroy();
            delete this._c2Knob;
        }
    },

    updateStartPointKnob : function() {
        if (this._startKnob) {
            var left = this.startLeft,
                top = this.startTop,
                screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._startKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    },
    updateEndPointKnob : function() {
        if (this._endKnob) {
            var left = this.endLeft,
                top = this.endTop,
                screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._endKnob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    },
    updateControlPoint1Knob : function() {
        if (this._c1Knob) {
            var left = this.controlPoint1[0], top = this.controlPoint1[1];
            var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._c1Knob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    },
    updateControlPoint2Knob : function() {
        if (this._c2Knob) {
            var left = this.controlPoint2[0], top = this.controlPoint2[1];
            var screenCoords = this.drawPane.drawing2screen([left,top,0,0]);
            this._c2Knob.setCenterPoint(screenCoords[0], screenCoords[1]);
        }
    },
    updateControlKnobs : function() {
        // update the position of our start/end point knobs when we update our other control points
        this.Super("updateControlKnobs", arguments);
        this.updateStartPointKnob();
        this.updateEndPointKnob();
        this.updateControlPoint1Knob();
        this.updateControlPoint2Knob();
    },

    //> @method drawLinePath.moveBy()
    // @include drawLine.moveBy()
    //<
    moveBy : function (x, y) {
        this.startLeft += x;
        this.startPoint[0] += x;
        this.startTop += y;
        this.startPoint[1] += y;
        this.endLeft += x;
        this.endPoint[0] += x;
        this.endTop += y;
        this.endPoint[1] += y;

        this.controlPoint1[0] += x;
        this.controlPoint1[1] += y;

        this.controlPoint2[0] += x;
        this.controlPoint2[1] += y;

        // regenerate points
        this.setPoints(this._getSegmentPoints(this.controlPoint1, this.controlPoint2));
        this.Super("moveBy", arguments);
    },

    //> @method drawLinePath.moveTo()
    // Moves the line path to the specified point
    //<
    moveTo : function (x, y) {
        this.moveBy(x-this.startLeft,y-this.startTop);
    }

}); // end DrawLinePath.addProperties








//> @type DrawShapeCommandType
// @value "close" Draws a straight line from the current point to the last "moveto" point. There
// are no arguments.
// @value "moveto" Start a new sub-path at a given (x,y) coordinate. The args array for this
// command type is a two-element array of the X and Y coordinates.
// @value "lineto" Draw a line from the current point to the given (x,y) coordinate which becomes
// the new current point. Multiple (x,y) coordinates may be specified to draw a path, in which
// case the last point becomes the new current point. The args array for this command type is
// an array of one or more Points (two-element arrays of the X and Y coordinates).
// @value "circleto" Draw a segment of a specified circle. A straight line (the "initial line
// segment") is drawn from the current point to the start of the circular arc. The args array
// for this command type contains 4 values:
// <ol start="0">
// <li>The center (cx,cy) Point (two-element array) of the circle.</li>
// <li>radius</li>
// <li>startAngle - Start angle in degrees</li>
// <li>endAngle - End angle in degrees</li>
// </ol>
// Note that the +explorerExample{circletoCommand,"circleto" Command example} can be very helpful
// when learning how to write "circleto" commands.
// @visibility drawing
//<


//> @object DrawShapeCommand
// Holds the information of a drawing command.
// @treeLocation Client Reference/Drawing/DrawItem/DrawShape
// @visibility drawing
//<

//> @attr drawShapeCommand.type (DrawShapeCommandType : null : IR)
// The command type.
// @visibility drawing
//<

//> @attr drawShapeCommand.args (Array : null : IR)
// The command arguments. The number of arguments and their types depend on this command's +link{type,type}.
// @visibility drawing
//<

//> @class DrawShape
// DrawItem to render a shape defined by executing the series of drawing commands in the
// +link{DrawShape.commands,commands} array.
// @inheritsFrom DrawItem
// @treeLocation Client Reference/Drawing/DrawItem
// @visibility drawing
//<
isc.defineClass("DrawShape", "DrawItem");

isc.DrawShape.addClassProperties({

    _$close: "close",
    _$moveto: "moveto",
    _$lineto: "lineto",
    _$circleto: "circleto"

});

isc.DrawShape.addProperties({

    //> @attr drawShape.knobs
    // <b>NOTE:</b> DrawShape items do not support knobs.
    // @see DrawItem.knobs
    // @include DrawItem.knobs
    //<

    vmlElementName: "SHAPE",
    svgElementName: "path",

    //> @attr drawShape.commands (Array of DrawShapeCommand : null : IRW)
    // The drawing commands that will be executed to render the shape.
    //
    // @visibility drawing
    //<
    //commands: null


//> @method drawShape.setCommands()
// Sets the +link{commands,commands} that define this shape.
// @param commands (Array of DrawShapeCommand) the new commands.
// @visibility drawing
//<
setCommands : function (commands) {
    this.commands = commands;
    if (this.drawingVML) {
        this._getVMLHandle().path = this._getPathVML();
    } else if (this.drawingSVG) {
        this._svgHandle.setAttributeNS(null, "d", this._getPathDataSVG());
    } else if (this.drawingBitmap) {
        this.drawPane.redrawBitmap();
    }
    this._reshaped();
    this._initBoundingParams();
},

//sets correct values for left, top, width, height based on poins values
_initBoundingParams : function (includeStroke) {
    var bb = this.getBoundingBox(false, this._tempBoundingBox);
    this.left = bb[0];
    this.top = bb[1];
    this.width = bb[2] - bb[0];
    this.height = bb[3] - bb[1];
},

getBoundingBox : function (includeStroke, outputBox) {

    var box = (outputBox || new Array(4)),
        drawPane = this.drawPane,
        innerContentWidth = drawPane.getInnerContentWidth(),
        innerContentHeight = drawPane.getInnerContentHeight(),
        left = innerContentWidth,
        top = innerContentHeight,
        right = 0,
        bottom = 0,
        currentPoint;
    if (!this.commands || this.commands.length == 0) {
        box[0] = box[1] = 0;
        box[2] = innerContentWidth;
        box[3] = innerContentHeight;
        return box;
    }
    for (var i = 0; i < this.commands.length; i++) {
        var command = this.commands[i],
            type = command.type,
            args = command.args;
        if (type == "moveto") {
            currentPoint = args;
        } else if (type == "lineto") {
            var points = args,
                point = points[0];
            if (currentPoint) {
                if (top > currentPoint[1]) top = currentPoint[1];
                if (left > currentPoint[0]) left = currentPoint[0];
                if (bottom < currentPoint[1]) bottom = currentPoint[1];
                if (right < currentPoint[0]) right = currentPoint[0];
            }
            if (top > point[1]) top = point[1];
            if (left > point[0]) left = point[0];
            if (bottom < point[1]) bottom = point[1];
            if (right < point[0]) right = point[0];
            currentPoint = point;
        } else if (type == "circleto") {
            var centerPoint = args[0],
                cx = centerPoint[0],
                cy = centerPoint[1],
                radius = args[1],
                cTop = cy - radius,
                cBottom = cy + radius,
                cLeft = cx - radius,
                cRight = cx + radius;
            if (currentPoint) {
                if (top > currentPoint[1]) top = currentPoint[1];
                if (left > currentPoint[0]) left = currentPoint[0];
                if (bottom < currentPoint[1]) bottom = currentPoint[1];
                if (right < currentPoint[0]) right = currentPoint[0];
            }

            if (top > cTop) top = cTop;
            if (left > cLeft) left = cLeft;
            if (bottom < cBottom) bottom = cBottom;
            if (right < cRight) right = cRight;
        }
    }

    box[0] = left;
    box[1] = top;
    box[2] = right;
    box[3] = bottom;
    return box;
},

//> @method drawShape.moveTo(left,top)
// Move both the start and end points of the line, such that the startPoint ends up at the
// specified coordinate and the line length and angle are unchanged.
//
// @param left (int) new startLeft coordinate in pixels
// @param top (int) new startTop coordinate in pixels
// @visibility drawing
//<
moveTo : function (x, y) {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    var dX = x - bbox[0];
    var dY = y - bbox[1];
    this.moveBy(dX, dY);
},

//> @method drawShape.moveBy()
// Move the drawShape by the specified delta
// @param dX (int) number of pixels to move horizontally
// @param dY (int) number of pixels to move vertically
// @visibility drawing
//<
moveBy : function (dX, dY) {
 this.left += dX;
 this.top += dY;
 if (this.commands) {
     for (var i = 0; i < this.commands.length; i++) {
         var command = this.commands[i],
             type = command.type,
             args = command.args;
         if (type == "moveto") {
             args[0] += dX;
             args[1] += dY;
         } else if (type == "lineto") {
             var points = args,
                 point = points[0];
             point[0] += dX;
             point[1] += dY;
         } else if (type == "circleto") {
             var centerPoint = args[0];
             centerPoint[0] += dX;
             centerPoint[1] += dY;
         }
     }
     this.setCommands(this.commands);
 }

 this.Super("moveBy", arguments);
},

//> @method drawShape.resizeBy()
// Resize by the specified delta
// @param dX (int) number of pixels to resize by horizontally
// @param dY (int) number of pixels to resize by vertically
// @visibility drawing
//<
resizeBy : function (dX, dY) {
    var bbox = this.getBoundingBox(false, this._tempBoundingBox);
    var widthMultiplier = 1 + dX / (bbox[2] - bbox[0]);
    var heightMultiplier = 1 + dY / (bbox[3] - bbox[1]);
    if (this.commands) {
        for (var i = 0; i < this.commands.length; i++) {
            var command = this.commands[i],
                type = command.type,
                args = command.args;
            if (type == "moveto") {
                if (widthMultiplier != 0) args[0] = bbox[0] + ((args[0] - bbox[0]) * widthMultiplier);
                if (heightMultiplier != 0) args[1] = bbox[1] + ((args[1] - bbox[1]) * heightMultiplier);
            } else if (type == "lineto") {
                var points = args,
                    point = points[0];
                if (widthMultiplier != 0) point[0] = bbox[0] + ((point[0] - bbox[0]) * widthMultiplier);
                if (heightMultiplier != 0) point[1] = bbox[1] + ((point[1] - bbox[1]) * heightMultiplier);
            } else if (type == "circleto") {
                var centerPoint = args[0],
                    r = args[1];
                if (widthMultiplier != 0) centerPoint[0] = bbox[0] + ((centerPoint[0] - bbox[0]) * widthMultiplier);
                if (heightMultiplier != 0) centerPoint[1] = bbox[1] + ((centerPoint[1] - bbox[1]) * heightMultiplier);
                if (widthMultiplier != 0 && heightMultiplier != 0) args[1] *= widthMultiplier * heightMultiplier;
                // TODO probably circle resizing could be improved esp if we'll add support for ellipses
            }
        }
        this.setCommands(this.commands);
    }

    this.Super("resizeBy", arguments);
},

_$close: isc.DrawShape._$close,
_$moveto: isc.DrawShape._$moveto,
_$lineto: isc.DrawShape._$lineto,
_$circleto: isc.DrawShape._$circleto,
_computedCircletoValues: [],
_getPathVML : function (outputTemplate) {
    var template = outputTemplate || [];

    var commands = this.commands;
    if (commands != null && commands.length > 0) {
        var pow10 = this.drawPane._pow10;
        for (var i = 0; i < commands.length; ++i) {
            var command = commands[i],
                type = command.type,
                args = command.args;
            if (type == this._$close) {
                template.push("x");
            } else if (type == this._$moveto) {
                var point = args;
                template.push("m", (point[0] * pow10) << 0, ",", (point[1] * pow10) << 0);
            } else if (type == this._$lineto) {
                var points = args,
                    point = points[0];
                template.push("l", (point[0] * pow10) << 0, ",", (point[1] * pow10) << 0);
                for (var n = 1; n < points.length; ++n) {
                    point = points[n];
                    template.push(",", (point[0] * pow10) << 0, ",", (point[1] * pow10) << 0);
                }
            } else if (type == this._$circleto) {
                var centerPoint = args[0],
                    cx = (centerPoint[0] * pow10) << 0,
                    cy = (centerPoint[1] * pow10) << 0,
                    r = (args[1] * pow10) << 0,
                    startAngle = args[2],
                    endAngle = args[3],
                    totalAngle = endAngle - startAngle;
                totalAngle = Math.min(totalAngle, 360);

                template.push("ae", cx, ",", cy, ",",
                              r, ",", r, ",",
                              Math.floor(startAngle * -65536), ",", Math.ceil(totalAngle * -65536));
            }
        }
    }

    if (outputTemplate == null) return template.join(isc.emptyString);
},

_$attributesVMLTemplate: [
    "STYLE='width:",                        // [0]
    ,                                       // [1] width
    "px; height:",                          // [2]
    ,                                       // [3] height
    "px' COORDSIZE='",                      // [4]
    ,                                       // [5] width
    " ",                                    // [6]
    ,                                       // [7] height
    "' PATH='"                              // [8]
],
getAttributesVML : function () {
    var template = this._$attributesVMLTemplate,
        origTemplateLength = template.length;

    var drawPane = this.drawPane,
        innerContentWidth = drawPane._viewPortWidth,
        innerContentHeight = drawPane._viewPortHeight;
    template[1] = innerContentWidth;
    template[5] = innerContentWidth * this.drawPane._pow10;
    template[3] = innerContentHeight;
    template[7] = innerContentHeight * this.drawPane._pow10;

    this._getPathVML(template);
    template.push("'"); // End the PATH attribute.

    var attrs = template.join(isc.emptyString);
    template.setLength(origTemplateLength);
    return attrs;
},

_getPathDataSVG : function (outputTemplate) {
    var template = outputTemplate || [];

    var commands = this.commands;
    if (commands != null && commands.length > 0) {
        var radPerDeg = isc.DrawShape._radPerDeg;
        for (var i = 0; i < commands.length; ++i) {
            var command = commands[i],
                type = command.type,
                args = command.args;
            if (type == "close") {
                template.push(" Z");
            } else if (type == "moveto") {
                var point = args;
                template.push(" M ", point[0], " ", point[1]);
            } else if (type == "lineto") {
                var points = args,
                    point = points[0];
                template.push(" L ", point[0], " ", point[1]);
                for (var n = 1; n < points.length; ++n) {
                    point = points[n];
                    template.push(" ", point[0], " ", point[1]);
                }
            } else if (type == "circleto") {
                var centerPoint = args[0],
                    cx = centerPoint[0],
                    cy = centerPoint[1],
                    radius = args[1],
                    startAngle = args[2],
                    endAngle = args[3],
                    largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? "1" : "0",
                    sweepFlag;

                // Note: SVG's "positive angle direction" is the opposite of ours.
                //
                // Clamp the angle range to strictly less than 360° so that the SVG renderer
                // does not fail to draw a full circle.
                if (startAngle <= endAngle) {
                    sweepFlag = "1";
                    endAngle = Math.min(endAngle, startAngle + 359.9);
                } else {
                    sweepFlag = "0";
                    endAngle = Math.max(startAngle - 359.9, endAngle);
                }

                // First compute the starting point of the arc. We need to "lineto" this point.
                var sx = cx + radius * Math.cos(startAngle * radPerDeg),
                    sy = cy - radius * Math.sin(-startAngle * radPerDeg);
                template.push(" L ", sx, " ", sy);

                // Next compute the ending point of the arc.
                var x = cx + radius * Math.cos(endAngle * radPerDeg),
                    y = cy - radius * Math.sin(-endAngle * radPerDeg);

                template.push(" A ", radius, " ", radius, " ", startAngle <= endAngle ? -startAngle : -endAngle, " ", largeArcFlag, " ", sweepFlag, " ", x, " ", y);
            }
        }
    }

    if (outputTemplate == null) return template.join("");
},

_$attributesSVGTemplate: [
    "d='"                                   // [0]
],
getAttributesSVG : function () {
    var template = this._$attributesSVGTemplate,
        origTemplateLength = template.length;

    this._getPathDataSVG(template);
    template.push("'"); // End the `d' attribute.

    var attrs = template.join("");
    template.setLength(origTemplateLength);
    return attrs;
},

drawBitmapPath : function (context) {
    var commands = this.commands;
    if (commands != null && commands.length > 0) {
        if (this.lineWidth == 0) {
            context.strokeStyle = this.fillColor;
            context.globalAlpha = this.fillOpacity;
        }
        context.beginPath();
        for (var i = 0; i < commands.length; ++i) {
            var command = commands[i],
                type = command.type,
                args = command.args;
            if (type == "close") {
                context.closePath();
            } else if (type == "moveto") {
                var point = args;
                context.moveTo(point[0], point[1]);
            } else if (type == "lineto") {
                var points = args,
                    point = points[0];
                context.lineTo(point[0], point[1]);
                for (var n = 1; n < points.length; ++n) {
                    point = points[n];
                    context.lineTo(point[0], point[1]);
                }
            } else if (type == "circleto") {
                var centerPoint = args[0],
                    cx = centerPoint[0],
                    cy = centerPoint[1],
                    radius = args[1],
                    startAngle = args[2],
                    endAngle = args[3];
                context.arc(cx, cy, radius, startAngle * isc.DrawShape._radPerDeg, endAngle * isc.DrawShape._radPerDeg, endAngle < startAngle);
            }
        }
    }
}

}); // end DrawShape.addProperties

isc.DrawShape.markUnsupportedMethods(null, ["setStartArrow", "setEndArrow"]);








//------------------------------------------------------------------------------------------
//  Helpers
//------------------------------------------------------------------------------------------

isc.GraphMath = {
// convert polar coordinates (angle, distance) to screen coordinates (x, y)
// takes angles in degrees, at least -360 to 360 are supported, 0 degrees is 12 o'clock
zeroPoint : [0,0],
polar2screen : function (angle, radius, basePoint, round) {
    basePoint = basePoint || this.zeroPoint;
    var radians = Math.PI - ((angle+450)%360)/180*Math.PI;
    var point = [
        basePoint[0] + (radius * Math.cos(radians)), // x
        basePoint[1] + (-radius * Math.sin(radians)) // y
    ]
    if (round) {
        point[0] = Math.round(point[0]);
        point[1] = Math.round(point[1]);
    }
    return point;
},

// convert screen coordinates (x, y) to polar coordinates (angle, distance)
// returns an angle in degrees, 0-360, 0 degrees is 12 o'clock
screen2polar : function (x, y) {
    return [
        ((Math.PI - Math.atan2(-y,x))/Math.PI*180 + 270)%360, // angle
        isc.Math._hypot(x, y)]; // radius
},

// find the delta to go from angle1 to angle2, by the shortest path around the circle.  eg
// angle1=359, angle2=1, diff = 2.
// Does not currently support angles outside of 0-360
angleDifference : function (angle1, angle2) {
/*
[
isc.GraphMath.angleDifference(180, 90), // -90
isc.GraphMath.angleDifference(90, 180), // 90
isc.GraphMath.angleDifference(359, 1), // 2
isc.GraphMath.angleDifference(1, 359), // -2
isc.GraphMath.angleDifference(360, 1), // 1
isc.GraphMath.angleDifference(0, 1) // 1
];
*/
    var larger = Math.max(angle1, angle2),
        smaller = Math.min(angle1, angle2),
        clockwiseDiff = larger - smaller,
        counterDiff = smaller+360 - larger;
    if (counterDiff < clockwiseDiff) {
        var direction = larger == angle1 ? 1 : -1;
        return direction * counterDiff;
    } else {
        var direction = larger == angle1 ? -1 : 1;
        return direction * clockwiseDiff;
    }
},

// straight line difference between two points
straightDistance : function (pt1, pt2) {
    return isc.Math._hypot(pt1[0] - pt2[0], pt1[1] - pt2[1]);
},



// given coordinates for a line, and a length to trim off of each end of the line,
// return the coordinates for the trimmed line
trimLineEnds : function (x1, y1, x2, y2, trimStart, trimEnd) {
    // don't allow trimming to reverse the direction of the line - stop at the (proportional)
    // centerpoint, except for a fractional pixel difference between endpoints to preserve the
    // orientation of the line (and therefore any arrowheads)
    // TODO extend the reach of this logic so arrowheads *disappear* when the line is too short for them
    var fullLength = isc.Math._hypot(x2 - x1, y2 - y1);
    if (trimStart+trimEnd > fullLength) {
        var midX = trimStart/(trimStart+trimEnd) * (x2-x1) + x1;
        var midY = trimStart/(trimStart+trimEnd) * (y2-y1) + y1;
        return [
            midX + (x1==x2 ? 0 : x1>x2 ? 0.01 : -0.01),
            midY + (y1==y2 ? 0 : y1>y2 ? 0.01 : -0.01),
            midX + (x1==x2 ? 0 : x1>x2 ? -0.01 : 0.01),
            midY + (y1==y2 ? 0 : y1>y2 ? -0.01 : 0.01)
        ]
    }
    var angle = Math.atan2(y1-y2,x2-x1);
    return [
        x1 + (trimStart * Math.cos(angle)),
        y1 - (trimStart * Math.sin(angle)),
        x2 - (trimEnd * Math.cos(angle)),
        y2 + (trimEnd * Math.sin(angle))
    ]
}
} // end isc.GraphMath



// center a canvas on a new position
isc.Canvas.addProperties({
    setCenter : function (x, y) {
        this.moveTo(x - this.getVisibleWidth()/2, y - this.getVisibleHeight()/2);
    },
    getCenter : function () {
        return [
            this.getLeft() + this.getVisibleWidth()/2,
            this.getTop() + this.getVisibleHeight()/2
        ]
    }
})






/*
 LinkedList.
*/
isc.defineClass("LinkedList", "Class").addProperties({
length: 0,
init : function () {
    this.head = null;
},
add: function(data) {
    var node = {next:null,data:data};
    if(!this.head) {
        this.head = node;
    } else {
        var current = this.head;
        while(current.next) {
            current = current.next;
        }
        current.next = node;
    }
    this.length++;
},
get: function(index) {
    var data = null;
    if(index >= 0 && index < this.length) {
        var current = this.head, i = 0;
        while(i++ < index) {
            current = current && current.next;
        }
        data = current.data;
    }
    return data;
},
remove: function(index) {
    var data = null;
    if(index >= 0 && index < this.length) {
        var current = this.head, i = 0;
        if(index === 0) {
            this.head = current.next;
        } else {
            var previous;
            while(i++ < index) {
                previous = current;
                current = current && current.next;
            }
            previous.next = current.next;
        }
        data = current.data;
        this.length--;
    }
    return data;
},
toArray: function() {
    var array = [], current = this.head;
    while(current) {
        array.push(current.data);
        current = current.next;
    }
    return array;
}
});

/*
 A quadtree provides indexing and quick lookup of shapes located in 2D space. A quadtree
 will split a space into
 4 subspaces when a threshold of max_objects has been reached. Subdivision will stop when
 max_depth has been reached.
 Given a point, a quadtree will return the number of objects found in the quadrant containing
 this point.
*/
isc.defineClass("QuadTree", "Class").addProperties({
depth: 0,
maxDepth: 0,
maxChildren: 0,
init : function () {
    this.root = null;
    this.bounds = null;
},
insert : function(item) {
    if(isc.isAn.Array(item)) {
        var len = item.length;
        for(var i = 0; i < len; i++) {
            this.root.insert(item[i]);
        }
    } else {
        this.root.insert(item);
    }
},
remove : function(item) {
    this.root.remove(item);
},
clear : function() {
    this.root.clear();
},
retrieve : function(item) {
    return this.root.retrieve(item).slice();
},
update : function(item) {
    return this.root.update(item);
}
});

isc.defineClass("QuadTreeNode", "Class").addClassProperties({
TOP_LEFT:0,
TOP_RIGHT:1,
BOTTOM_LEFT:2,
BOTTOM_RIGHT:3
});

isc.QuadTreeNode.addProperties({
depth: 0,
maxDepth: 4,
maxChildren: 4,
init : function() {
    this.bounds = null;
    this.nodes = [];
    this.children = isc.LinkedList.create();
},
insert : function(item) {
    if(this.nodes.length) {
        var quadrants = this.findQuadrants(item);
        for(var i = 0; i < quadrants.length; ++i) {
            var quadrant = quadrants[i];
            this.nodes[quadrant].insert(item);
        }
        return;
    }
    this.children.add(item);
    var len = this.children.length;
    if(!(this.depth >= this.maxDepth) && len > this.maxChildren) {
        this.subdivide();
        for(var i = 0; i < len; i++) {
            this.insert(this.children.get(i));
        }
        this.children = isc.LinkedList.create();
    }
},
remove : function(item) {
    if(this.nodes.length) {
        var quadrants = this.findQuadrants(item);
        for(var i = 0; i < quadrants.length; ++i) {
            var quadrant = quadrants[i];
            this.nodes[quadrant].remove(item);
        }
    }
    for(var j = 0; j < this.children.length; ++j) {
        var data = this.children.get(j);
        if(data === item) {
            this.children.remove(j);
        }
    }
},
retrieve : function(point) {
    if(this.nodes.length) {
        var quadrant = this.findQuadrant(point);
        return this.nodes[quadrant].retrieve(point);
    }
    return this.children.toArray();
},
findQuadrant: function(point) {
    var b = this.bounds;
    var left = (point.x > b.x + b.width / 2)? false : true;
    var top = (point.y > b.y + b.height / 2)? false : true;
    //top left
    var quadrant = isc.QuadTreeNode.TOP_LEFT;
    if(left) {
        //left side
        if(!top) {
            //bottom left
            quadrant = isc.QuadTreeNode.BOTTOM_LEFT;
        }
    } else {
        //right side
        if(top) {
            //top right
            quadrant = isc.QuadTreeNode.TOP_RIGHT;
        } else {
            //bottom right
            quadrant = isc.QuadTreeNode.BOTTOM_RIGHT;
        }
    }
    return quadrant;
},
findQuadrants: function(item) {
    var quadrants = [];
    var qmap = {};
    var quadrant = this.findQuadrant({x:item.x,y:item.y});
    quadrants.push(quadrant);
    qmap[quadrant] = true;
    quadrant = this.findQuadrant({x:item.x+item.width,y:item.y+item.height});
    if(!qmap[quadrant]) {
        quadrants.push(quadrant);
        qmap[quadrant] = true;
    }
    quadrant = this.findQuadrant({x:item.x,y:item.y+item.height});
    if(!qmap[quadrant]) {
        quadrants.push(quadrant);
        qmap[quadrant] = true;
    }
    quadrant = this.findQuadrant({x:item.x+item.width,y:item.y});
    if(!qmap[quadrant]) {
        quadrants.push(quadrant);
    }
    return quadrants;
},
subdivide : function() {
    var depth = this.depth + 1;
    var bx = this.bounds.x;
    var by = this.bounds.y;
    //floor the values
    var b_w_h = (this.bounds.width / 2)|0;
    var b_h_h = (this.bounds.height / 2)|0;
    var bx_b_w_h = bx + b_w_h;
    var by_b_h_h = by + b_h_h;
    //top left
    this.nodes[isc.QuadTreeNode.TOP_LEFT] = isc.QuadTreeNode.create({depth:depth});
    this.nodes[isc.QuadTreeNode.TOP_LEFT].bounds = {x:bx, y:by, width:b_w_h, height:b_h_h};
    //top right
    this.nodes[isc.QuadTreeNode.TOP_RIGHT] = isc.QuadTreeNode.create({depth:depth});
    this.nodes[isc.QuadTreeNode.TOP_RIGHT].bounds = {x:bx_b_w_h,y:by,width:b_w_h,height:b_h_h};
    //bottom left
    this.nodes[isc.QuadTreeNode.BOTTOM_LEFT] = isc.QuadTreeNode.create({depth:depth});
    this.nodes[isc.QuadTreeNode.BOTTOM_LEFT].bounds = {x:bx,y:by_b_h_h,width:b_w_h,height:b_h_h};
    //bottom right
    this.nodes[isc.QuadTreeNode.BOTTOM_RIGHT] = isc.QuadTreeNode.create({depth:depth});
    this.nodes[isc.QuadTreeNode.BOTTOM_RIGHT].bounds = {x:bx_b_w_h,y:by_b_h_h,width:b_w_h,height:b_h_h};
},
clear : function() {
    this.children = isc.LinkedList.create();
    var len = this.nodes.length;
    for(var i = 0; i < len; i++) {
        this.nodes[i].clear();
    }
    this.nodes = [];
    this.depth = 0;
    this.maxDepth = 4;
    this.maxChildren = 4;
},
update : function(item) {
    this.remove(item);
    this.insert(item);
}
});





//------------------------------------------------------------
//> @class DrawKnob
// Canvas that renders a +link{drawItem} into a +link{DrawPane} and provides interactivity for
// that drawItem, including drag and drop.
// <P>
// A DrawKnob can either be initialized with a +link{drawKnob.knobShape,DrawItem knobShape} or created via
// the +link{type:AutoChild} pattern.
// <P>
// DrawKnobs are used by the +link{drawItem.knobs,drawItem control knobs} subsystem.
//
// @inheritsFrom Canvas
// @treeLocation Client Reference/Drawing
// @visibility drawing
//<

isc.defineClass("DrawKnob", "Canvas").addProperties({
    width:10, height:10,
    overflow:"hidden",
    //border:"1px solid black",

    cursor:"crosshair",

    canDrag:true,
    dragAppearance:"none",

    keepInParentRect:true,
    autoDraw:false, // typically addChild to drawPane

    //> @attr drawKnob.knobShape (AutoChild DrawItem : null : R)
    // The +link{DrawItem} instance rendered into this DrawKnob's drawPane
    // @visibility drawing
    //<

    //> @attr drawKnob.knobDefaults (DrawOval Properties : {...} : IRA)
    // Default properties for this component's +link{drawKnob.knobShape}. Has the
    // following properties by default:
    // <pre>
    //  radius : 5,
    //  lineWidth:2,
    //  fillColor:"#FF0000",
    //  fillOpacity:0.5,
    // </pre>
    // As with any auto-child defaults block, use +link{Class.changeDefaults()} to modify this
    // object.
    // @visibility drawing
    //<
    knobShapeDefaults : {
        _constructor:isc.DrawOval,
        // note that this is just the size of the visible shape - the size of the
        // draggable handle is governed by drawKnob.width / height
        radius : 5,
        lineWidth:2,
        fillColor:"#FF0000",
        fillOpacity:0.5,
        autoDraw:true,

        // suppress updateControlKnobs behaivor since we don't expect controlKnobs ON controlKnobs!
        updateControlKnobs : function () {
            return;
        },
        // Override erase to wipe the DrawKnob canvas out as well
        erase : function () {
            // erase() on the draw shape calls clear on the DrawKnob (canvas)
            // Avoid recursion via an "erasing" flag
            if (this.erasing) return;

            this.erasing = true;
            if (this.creator.isDrawn()) this.creator.clear();
            this.Super("erase", arguments);
            delete this.erasing;
        }
    },

    // Public Attributes:

    //> @attr DrawKnob.drawPane (DrawPane : null : IR)
    // +link{DrawPane} into which this DrawKnob's +link{drawKnob.knobShape} will be rendered.
    // @visibility drawing
    //<

    //> @attr DrawKnob.x (integer : null : IR)
    // X-Coordinate for this DrawKnob. DrawKnob will initially be drawn centered over this
    // coordinate
    // @visibility drawing
    //<

    //> @attr DrawKnob.y (integer : null : IR)
    // Y-Coordinate for this DrawKnob. DrawKnob will initially be drawn centered over this
    // coordinate
    // @visibility drawing
    //<

    initWidget : function () {

        if (isc.Browser.isIE && isc.Browser.version < 11 && this.drawPane.drawingType == "bitmap") {
            this.setBackgroundColor("White");
            this.setOpacity(0);
        }

        this.left = this.x - this.width/2;
        this.top = this.y - this.height/2;

        // create the shape that serves as a visible representation of the knob
        this.knobShape = this.createAutoChild("knobShape", {
            drawPane: this.drawPane,
            centerPoint: [this.x, this.y]
        });

        // add to drawPane as a CanvasItem
        this._drawCallingAddCanvasItem = true;
        this.drawPane.addCanvasItem(this);
        delete this._drawCallingAddCanvasItem;
    },

    //> @method DrawKnob.setCenterPoint()
    // Sets the center point of the drawKnob. If the additional <code>drawingCoords</code> attribute
    // is passed, coordinates are expected to be already adjusted for drawPane pan and zoom.
    // Otherwise coordinates are expected to be absolute pixel coordinates within the drawPane.
    // @param x (integer) new x coordinate for this drawKnob
    // @param y (integer) new y coordinate for this drawKnob
    // @param [drawingCoords] (boolean) If specified, <code>x</code> and <code>y</code> values are
    //  expected to be drawing coordinates - already adjusted for any zoom or pan applied to the
    //  drawPane.
    // @visibility drawing
    //<
    setCenterPoint : function (x, y, drawingCoords) {
        var screenLeft, screenTop;
        if (drawingCoords) {
            var screenCoords = this.drawPane.drawing2screen([x - this._drawingWidth/2,
                                                             y - this._drawingHeight/2, 0,0]);
            screenLeft = screenCoords[0],
            screenTop = screenCoords[1];
        } else {
            screenLeft = x - this.width/2;
            screenTop = y - this.height/2;
        }
        this.moveTo(screenLeft << 0, screenTop << 0);
    },

    setRect : function (left, top, width, height, animating) {
        if (isc.isAn.Array(left)) {
            top = left[1];
            width = left[2];
            height = left[3];
            left = left[0];
        } else if (isc.isAn.Object(left)) {
            top = left.top;
            width = left.width;
            height = left.height;
            left = left.left;
        }

        var keepInParentRect = this.keepInParentRect;
        if (keepInParentRect) {
            var drawPaneWidth = this.drawPane.getWidth(),
                drawPaneHeight = this.drawPane.getHeight(),
                right = Math.min(left + width, drawPaneWidth),
                bottom = Math.min(top + height, drawPaneHeight);
            left = Math.max(left, 0);
            top = Math.max(top, 0);
            width = right - left;
            height = bottom - top;

            if (width < 1 || height < 1) {
                this.hide();
                return false;
            } else {
                this.show();
            }
        }

        return this.Super("setRect", [left, top, width, height, animating]);
    },

    draw : function () {
        var drawnByAddCanvasItem = (this._drawCallingAddCanvasItem);

        if (!drawnByAddCanvasItem) return this.Super("draw", arguments);
    },

    // when we're programmatically moved, update our knob shape position to match.
    // Exception: When a canvasItem is added to a drawPane, zoom / pan of the drawPane will
    // call moveTo() on the canvasItem. In this case our shape has already been repositioned.
    moved : function () {
        if (!this.synchingToPane) this.updateKnobShape();
    },

    // _updatePoints - move the knobShape directly, then fire the 'updatePoints' notification
    // that a shape such as a DrawRect can observe to change it's dimensions.
    // The state argument is either "start", "move", or "stop".
    _updatePoints : function (state) {
        var x = isc.EH.getX(),
            y = isc.EH.getY(),
            screenX = x -
                (this.drawPane.getPageLeft() + this.drawPane.getLeftMargin() +
                 this.drawPane.getLeftBorderSize()),
            screenY = y -
                (this.drawPane.getPageTop() + this.drawPane.getTopMargin() +
                 this.drawPane.getTopBorderSize());
        var drawingCoords = this.drawPane.screen2drawing(
        [
            screenX, screenY,
            0, 0 // not using width & height
        ]);

        var left = drawingCoords[0],
            top = drawingCoords[1],
            dX = left - (this._drawingLeft + this._drawingWidth/2),
            dY = top - (this._drawingTop + this._drawingHeight/2);

        // call the observable / overrideable updatePoints() method
        this.updatePoints(left, top, dX, dY, state);

        // Note: we rely on the updatePoints implementation to actually move the DrawKnob to the
        // appropriate position.
        // We *could* center ourselves over the mouse pointer here but this would not allow
        // things like restricting dragging per axis, so let the item actually shift us to the
        // right new position.
    },

    // updateKnobShape() - reposition the knobShape under the canvas - fired in response to
    // canvas.moved()
    updateKnobShape : function () {

        var drawingCoords = this.drawPane.screen2drawing([
            this.getLeft() + this.getWidth()/2,
            this.getTop() + this.getHeight()/2,
            0, 0 // not using width & height
        ]);

        var x = drawingCoords[0],
            y = drawingCoords[1],
            newDrawingLeft =  x - this._drawingWidth/2,
            newDrawingTop =  y - this._drawingHeight/2;

        // remember to update cached drawing coords! (correcting center to topleft)
        this._drawingLeft = newDrawingLeft,
        this._drawingTop = newDrawingTop;

        // update our knobShape position
        this.knobShape.setCenterPoint(x,y);
    },

    //> @method drawKnob.updatePoints()
    // Method called in response to the user dragging this DrawKnob. May be observed or overridden
    // to allow drawItems to react to user drag interactions on this knob.
    // <P>
    // Note that the default implementation does nothing. When working with draw knobs directly this
    // is typically where you would both update the shape being controlled by the draw knob, and
    // ensure the drawKnob gets repositioned. You may also need to update the drawKnob
    // position in response to the drawItem being repositioned, resized, etc.
    //
    // @param x (integer) new x-coordinate of the drawKnob
    // @param y (integer) new y-coordinate of the drawKnob
    // @param dX (integer) horizontal distance moved
    // @param dY (integer) vertical distance moved
    // @param state (String) either "start", "move", or "stop", to indicate the current phase
    // of dragging of the DrawKnob for which the points need to be updated
    // @visibility drawing
    //<
    updatePoints: function (x, y, dX, dY, state) {
//!DONTOBFUSCATE  We need to observe complete with the intact var names
    },

    // On clear, wipe out the knobShape
    clear : function () {
        this.Super("clear", arguments);
        this.knobShape.erase();
    },
    // We should destroy this.knobShape on destroy() but don't yet have a destroy method on
    // drawItems

    dragStart : function () {
        return this._updatePoints("start");
    },
    dragMove : function () {
        return this._updatePoints("move");
    },
    dragStop : function () {
        return this._updatePoints("stop");
    }
});

// register updatePoints as a stringMethod
isc.DrawKnob.registerStringMethods({
    updatePoints:"x,y,dX,dY"
});



//> @object GaugeSector
//
// Represents a sector on the gauge.
//
// @treeLocation Client Reference/Drawing/Gauge
// @visibility drawing
//<

//> @attr gaugeSector.fillColor (CSSColor : null : IR)
// @visibility drawing
//<

//> @attr gaugeSector.startAngle (float : 0 : IR)
// @visibility drawing
//<

//> @attr gaugeSector.endAngle (float : 0 : IR)
// @visibility drawing
//<

//> @attr gaugeSector.value (float : 0 : IR)
// @visibility drawing
//<


//> @class Gauge
//
// The Gauge widget class implements a graphical speedometer-style gauge for displaying
// a measurement by means of a needle on a dial. The dial is divided into sectors, each having
// its own color and value.
// <P>
// <b>NOTE:</b> you must load the Drawing +link{group:loadingOptionalModules,Optional Module}
// before you can use Gauge.
//
// @inheritsFrom DrawPane
// @treeLocation Client Reference/Drawing
// @visibility drawing
// @example Gauge
//<

isc.ClassFactory.defineClass("Gauge", "DrawPane");

isc.Gauge.addProperties({
width: 400,
height: 400,

redrawOnResize: true,

//> @attr gauge.dialRadius (float : 150 : IR)
// Radius in pixels of the dial.
//
// @visibility drawing
//<
dialRadius: 150,

//> @attr gauge.knobRadius (float : 6 : IR)
// Radius in pixels of the knob.
//
// @visibility internal
//<

knobRadius: 6,

//> @attr gauge.fontSize (int : 11 : IR)
// Font size of sector labels. Must be at least 3.
//
// @see DrawLabel.fontSize
// @visibility drawing
//<
fontSize: 11,

//> @attr gauge.borderWidth (int : 1 : IR)
// Pixel width for gauge sector borders.
//
// @see DrawItem.lineWidth
// @visibility drawing
//<
borderWidth: 1,

//> @attr gauge.borderColor (CSSColor : "#333333" : IR)
// Color for gauge sector borders.
//
// @see DrawItem.lineColor
// @visibility drawing
//<
borderColor: "#333333",

//> @attr gauge.scaleColor (CSSColor : null : IR)
// Color for gauge scale markings.
//
// Default value of null means to use the color specified by
// +link{gauge.borderColor}.
//<
scaleColor: null,

//> @attr gauge.needleColor (CSSColor : "#000000" : IR)
// Color for gauge needle.
//
// Value of null means to use the color specified by
// +link{gauge.borderColor}.  No matter the value, the needle
// border color will be taken from +link{gauge.borderColor}.
//<
needleColor: "#000000",

//> @attr gauge.sectorColors (Array of CSSColor : [ "#AFFFFF", "#008080", "#AAAFFF", "#FF0000", "#FFCC99", "#800080" ] : IR)
// Array of preset fill colors used by the default implementation of +link{Gauge.getDefaultFillColor()}
// to initialize the fill color of new sectors.
//
// <p>The default array of colors is:
// <table border="0" cellpadding="0" cellspacing="2">
//   <tr>
//     <td style="background-color:#AFFFFF;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#AFFFFF</a></td>
//     <td style="background-color:#008080;color:#FFF;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#008080</a></td>
//     <td style="background-color:#AAAFFF;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#AAAFFF</a></td>
//     <td style="background-color:#FF0000;color:#FFF;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#FF0000</a></td>
//     <td style="background-color:#FFCC99;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#FFCC99</a></td>
//     <td style="background-color:#800080;color:#FFF;width:90px;height:90px;text-align:center"><a style="vertical-align:middle">#800080</a></td>
//   </tr>
// </table>
// @see DrawItem.fillColor
// @visibility drawing
//<
sectorColors: [ "#AFFFFF", "#008080", "#AAAFFF", "#FF0000", "#FFCC99", "#800080" ],

//> @attr gauge.minValue (float : 0 : IRW)
// The minimum dial value.
//
// @visibility drawing
//<
minValue: 0,

//> @attr gauge.maxValue (float : 100 : IRW)
// The maximum dial value.
//
// @visibility drawing
//<
maxValue: 100,

//> @attr gauge.value (float : 0 : IRW)
// The current value on the dial.
//
// @visibility drawing
//<
value: 0,

//> @attr gauge.numMajorTicks (int : 0 : IRW)
// The number of major tick lines.
//
// @visibility drawing
//<
numMajorTicks: 0,

//> @attr gauge.numMinorTicks (int : 0 : IRW)
// The number of minor tick lines.
//
// @visibility drawing
//<
numMinorTicks: 0,

//> @attr gauge.labelPrefix (string : "" : IRW)
// The label prefix.
//
// @see Gauge.formatLabelContents
// @visibility drawing
//<
labelPrefix: "",

//> @attr gauge.labelSuffix (string : "%" : IRW)
// The label suffix.
//
// @see Gauge.formatLabelContents
// @visibility drawing
//<
labelSuffix: "%",

//> @attr gauge.drawnClockwise (boolean : true : IRW)
// Whether the sectors are drawn clockwise, and increasing the value causes the
// needle to move clockwise.
//
// @visibility drawing
//<
drawnClockwise: true,

//> @attr gauge.sectors (Array of GaugeSector : null : IRW)
// The GaugeSectors contained in this Gauge.
//
// If this this property is not specified, the gauge will
// be created with a default sector filling the gauge.
// @visibility drawing
//<
sectors: null,

//> @attr gauge.pivotPoint (Point : null : R)
// The pivot point of the needle.
//
// @visibility drawing
//<
pivotPoint: null,

//> @attr gauge.sectorDefaults (GaugeSector Properties : : IRA)
// Default GaugeSector properties for a newly created sector.
//<
sectorDefaults: {
    fillColor: null,
    startAngle: 0,
    endAngle: 0,
    value: 0
}

});

isc.Gauge.addMethods({
initWidget : function () {
    this.Super("initWidget", arguments);

    if (this.fontSize < 3) {
        this.logWarn("Gauge specified with fontSize:" + this.fontSize + ". Setting to 3.");
        this.fontSize = 3;
    }

    if (!(this.sectorColors instanceof Array)) {
        this.logWarn("Gauge specified with non-array sectorColors. Setting to [ \"#AFFFFF\" ].");
        this.sectorColors = [ "#AFFFFF" ];
    }
    if (this.sectorColors.length == 0) {
        this.logWarn("Gauge specified with empty sectorColors array. Setting to [ \"#AFFFFF\" ].");
        this.sectorColors = [ "#AFFFFF" ];
    }

    // If passed a min value that is greater than the max value, swap them.
    if (this.minValue > this.maxValue) {
        this.logWarn("Gauge specified with minValue:" + this.minValue + ", greater than " +
                     "maxValue:" + this.maxValue + ". Swapping.");
        var tmp = this.minValue;
        this.minValue = this.maxValue;
        this.maxValue = tmp;
    }

    // If passed a max value that is not at least 1 greater than the min value, set the max
    // value to 1 + minValue.
    if (!(this.maxValue >= 0.99999 + this.minValue)) {
        this.logWarn("Gauge specified with maxValue:" + this.maxValue + ", not at least 1 " +
                     "greater than minValue:" + this.minValue);
        this.maxValue = 1 + this.minValue;
    }

    // Ensure that the value is between the min value and the max value.
    this.value = Math.min(Math.max(this.value, this.minValue), this.maxValue);

    this.numMajorTicks = Math.floor(this.numMajorTicks);
    this.numMajorTicks = Math.max(0, this.numMajorTicks);
    if (this.numMajorTicks != 0) {
        this.numMajorTicks = Math.max(2, this.numMajorTicks);
    }

    this.numMinorTicks = Math.floor(this.numMinorTicks);
    this.numMinorTicks = Math.max(0, this.numMinorTicks);
    if (this.numMinorTicks != 0) {
        this.numMinorTicks = Math.max(2, this.numMinorTicks);
    }

    this._makePivotPoint(this.getInnerContentWidth(), this.getInnerContentHeight());

    this.setSectors(this.sectors ? this.sectors : [{
        fillColor: this.getDefaultFillColor(0),
        startAngle: 0,
        endAngle: 180,
        value: this.maxValue
    }]);

},

resized : function (deltaX, deltaY) {
    this._makePivotPoint(this.getInnerContentWidth(), this.getInnerContentHeight());
    this._makeItems();
},

_makeItems : function () {
    this.erase();

    if (this._tickLines != null) {
        var existingTickLines = this._tickLines;
        for (var i = 0; i < existingTickLines.length; ++i) {
            existingTickLines[i].destroy();
        }
        delete this._tickLines;
    }
    if (this._labels != null) {
        var existingLabels = this._labels;
        for (var i = 0; i < existingLabels.length; ++i) {
            existingLabels[i].destroy();
        }
        delete this._labels;
    }

    this._makeDrawSectors();
    this._makeNeedle();
    this._positionNeedleTriangle(this.value);
    this._makeLabels();
},

_makePivotPoint : function (width, height) {
    this.pivotPoint = [ width / 2, height * 0.70 ];
},

_makeDrawSectors : function () {


    var drawSectors = new Array(this.sectors.length);

    if (this._drawSectors) {
        for (var i = 0; i < this._drawSectors.length; ++i) {
            this._drawSectors[i].destroy();
        }
    }

    var sectors = this.sectors;
    for (var sectorIndex = 0; sectorIndex < sectors.length; ++sectorIndex) {
        var sector = sectors[sectorIndex];

        var startAngle, endAngle;
        if (this.drawnClockwise) {
            startAngle = sector.startAngle - 180;
            endAngle = sector.endAngle - 180;
        } else {
            startAngle = -sector.endAngle;
            endAngle = -sector.startAngle;
        }

        var drawSector;
        drawSectors[sectorIndex] = drawSector = isc.DrawSector.create({
            radius: this.dialRadius,
            centerPoint: this.pivotPoint,
            startAngle: startAngle,
            endAngle: endAngle,
            lineWidth: this.borderWidth,
            lineColor: this.borderColor,
            fillColor: sector.fillColor
        });
        this.addDrawItem(drawSector, true);
    }
    this._drawSectors = drawSectors;

    this._makeTickLines();
},

_makeTickLines : function () {


    var numMajorTicks = this.numMajorTicks;
    var numMinorTicks = this.numMinorTicks;
    var drawnClockwise = this.drawnClockwise;
    var pivotPoint = this.pivotPoint;

    var tickLines;
    var i;

    if (!this._tickLines) {
        tickLines = new Array(numMajorTicks + numMinorTicks);
    } else if (this._tickLines.length != numMajorTicks + numMinorTicks) {
        for (i = numMajorTicks + numMinorTicks; i < this._tickLines.length; ++i) {
            this._tickLines[i].destroy();
        }
        tickLines = new Array(numMajorTicks + numMinorTicks);
        for (i = 0; i < tickLines.length; ++i) {
            tickLines[i] = this._tickLines[i];
        }
    } else {
        tickLines = this._tickLines;
    }

    var scaleColor = this.scaleColor ? this.scaleColor : this.borderColor;

    for (i = 0; i < numMajorTicks; ++i) {
        var angleRad = Math.PI - Math.PI * i / (numMajorTicks - 1);
        if (!drawnClockwise) {
            angleRad = Math.PI - angleRad;
        }

        // See _positionNeedleTriangle() for a short explanation of the math. Essentially
        // polar coordinates are being converted to Cartesian.
        var x = (this.dialRadius + 3) * Math.cos(angleRad);
        var y = (this.dialRadius + 3) * Math.sin(angleRad);
        var p = [ pivotPoint[0] + x, pivotPoint[1] - y ];

        var x2 = (this.dialRadius - 10) * Math.cos(angleRad);
        var y2 = (this.dialRadius - 10) * Math.sin(angleRad);
        var p2 = [ pivotPoint[0] + x2, pivotPoint[1] - y2 ];

        if (!tickLines[i]) {
            tickLines[i] = isc.DrawLine.create({
                lineColor: scaleColor,
                startPoint: p2,
                endPoint: p,
                lineWidth: 2
            });
        } else {
            tickLines[i].setLineColor(scaleColor);
            tickLines[i].setStartPoint(p[0], p[1]);
            tickLines[i].setEndPoint(p2[0], p2[1]);
        }
    }

    for (var j = 0; j < numMinorTicks; ++j, ++i) {
        var angleRad = Math.PI - Math.PI * j / (numMinorTicks - 1);
        if (!drawnClockwise) {
            angleRad = Math.PI - angleRad;
        }

        var x = this.dialRadius * Math.cos(angleRad);
        var y = this.dialRadius * Math.sin(angleRad);
        var p = [ pivotPoint[0] + x, pivotPoint[1] - y ];

        var x2 = (this.dialRadius - 5) * Math.cos(angleRad);
        var y2 = (this.dialRadius - 5) * Math.sin(angleRad);
        var p2 = [ pivotPoint[0] + x2, pivotPoint[1] - y2 ];

        if (!tickLines[i]) {
            tickLines[i] = isc.DrawLine.create({
                lineColor: scaleColor,
                startPoint: p2,
                endPoint: p,
                lineWidth: 1
            });
        } else {
            tickLines[i].setLineColor(scaleColor);
            tickLines[i].setStartPoint(p[0], p[1]);
            tickLines[i].setEndPoint(p2[0], p2[1]);
        }
    }

    for (i = 0; i < tickLines.length; ++i) {
        this.addDrawItem(tickLines[i], true);
    }
    this._tickLines = tickLines;
},

_makeNeedle : function () {


    var triangleColor = this.needleColor ? this.needleColor : this.borderColor;

    if (!this._needleTriangle) {
        this._needleTriangle = isc.DrawTriangle.create({
            drawPane: this,
            autoDraw: true,
            lineColor: this.borderColor,
            lineWidth: this.borderWidth,
            fillColor: triangleColor
        });
    } else {
        var triangle = this._needleTriangle;
        triangle.setLineColor(this.borderColor);
        triangle.setLineWidth(this.borderWidth);
        triangle.setFillColor(triangleColor);
        this.addDrawItem(triangle, true);
    }

    this._makeKnob();
},

_makeKnob : function () {


    var knobColor = this.needleColor ? this.needleColor : this.borderColor;

    if (!this._knob) {
        this._knob = isc.DrawOval.create({
            drawPane: this,
            autoDraw: true,
            centerPoint: this.pivotPoint,
            radius: this.knobRadius,
            lineColor: this.borderColor,
            lineWidth: this.borderWidth,
            fillColor: knobColor
        });
    } else {
        var knob = this._knob;
        knob.setCenterPoint(this.pivotPoint[0], this.pivotPoint[1]);
        knob.setRadius(this.knobRadius);
        knob.setLineColor(this.borderColor);
        knob.setLineWidth(this.borderWidth);
        knob.setFillColor(knobColor);
        this.addDrawItem(knob, true);
    }
},

_makeLabels : function () {


    var sectors = this.sectors;
    var labels = new Array(1 + sectors.length);

    if (this._labels) {
        for (var i = 0; i < this._labels.length; ++i) {
            this._labels[i].destroy();
        }
    }

    var minimumLabel;
    labels[0] = minimumLabel = this._makePositionedLabel(this.formatLabelContents(this.minValue),
                                                         this.minValue);
    this.addDrawItem(minimumLabel, true);

    for (var sectorIndex = 0; sectorIndex < sectors.length; ++sectorIndex) {
        var sector = sectors[sectorIndex];
        var label = this._makePositionedLabel(this.formatLabelContents(sector.value),
                                              sector.value);
        labels[1 + sectorIndex] = label;
        this.addDrawItem(label, true);
    }

    this._labels = labels;
},

//> @method gauge.setMinValue()
// Sets the minimum dial value, rescaling all sectors and the dial value.
//
// @param minValue (float) the new minimum dial value. Must be at least 1 less than the
// maximum dial value. If <code>minValue</code> is not at least 1 less than the maximum value,
// then it is set to <code>maxValue - 1</code>.
// @visibility drawing
//<
setMinValue : function (minValue) {
    minValue = Math.min(0 + minValue, this.maxValue - 1);
    this._rescaleSectors(minValue, this.maxValue);
},

//> @method gauge.setMaxValue()
// Sets the maximum dial value, rescaling all sectors and the dial value.
//
// @param maxValue (float) the new maximum dial value. Must be at least 1 greater than the
// minimum dial value. If <code>maxValue</code> is not at least 1 greater than the minimum
// value, then it is set to <code>1 + minValue</code>.
// @visibility drawing
//<
setMaxValue : function (maxValue) {
    maxValue = Math.max(0 + maxValue, 1 + this.minValue);
    this._rescaleSectors(this.minValue, maxValue);
},

_rescaleSectors : function (newMinValue, newMaxValue) {
    var maxValue = this.maxValue;
    var minValue = this.minValue;
    var sectors = this.sectors;

    var scale = maxValue - minValue;
    var newScale = newMaxValue - newMinValue;

    var prevEndAngle = 0;
    for (var sectorIndex = 0; sectorIndex < sectors.length; ++sectorIndex) {
        var sector = sectors[sectorIndex];
        var newValue = newScale * (sector.value - minValue) / scale + newMinValue;
        sector.value = newValue;
        sector.startAngle = prevEndAngle;
        sector.endAngle = prevEndAngle = this._getSectorEndAngle(newValue, newMinValue, newScale);
    }

    this.value = newScale * (this.value - minValue) / scale + newMinValue;

    this.minValue = minValue = newMinValue;
    this.maxValue = maxValue = newMaxValue;

    this._makeItems();
},

//> @method gauge.setValue()
// Sets the value on the dial that the needle is displaying.
//
// @param value (float) the new dial value. Must be between +link{gauge.minValue, minValue} and
// +link{gauge.maxValue, maxValue}.
// @visibility drawing
//<
setValue : function (value) {
    // Ensure that `value` is between the min value and the max value.
    value = Math.min(Math.max(0 + value, this.minValue), this.maxValue);
    this._positionNeedleTriangle(value);
    this.value = value;
},

//> @method gauge.setNumMajorTicks()
// Sets the number of major tick lines.
//
// <p><b>NOTE:</b> To divide the dial into <i>n</i> regions, you will need <i>n</i> + 1 ticks.
// For example, if the minimum value is 0 and the maximum value is 100, then to place major
// tick lines at 0, 10, 20, 30, ..., 90, 100, you need 11 (10 + 1) major ticks.
//
// @param numMajorTicks (int) the number of major tick lines to draw. Must be either 0 or an
// integer greater than or equal to 2.
// @visibility drawing
//<
setNumMajorTicks : function (numMajorTicks) {
    numMajorTicks = Math.floor(numMajorTicks);
    if (this.numMajorTicks != numMajorTicks) {
        numMajorTicks = Math.max(0, numMajorTicks);
        if (numMajorTicks != 0) {
            numMajorTicks = Math.max(2, numMajorTicks);
        }
        this.numMajorTicks = numMajorTicks;
        this._makeItems();
    }
},

//> @method gauge.setNumMinorTicks()
// Sets the number of minor tick lines.
//
// <p><b>NOTE:</b> To divide the dial into <i>n</i> regions, you will need <i>n</i> + 1 ticks.
// For example, if the minimum value is 0 and the maximum value is 100, then to place minor
// tick lines at 0, 1, 2, 3, 4, 5, ..., 99, 100, you need 101 (100 + 1) minor ticks.
//
// @param numMinorTicks (int) the number of minor tick lines to draw. Must be either 0 or an
// integer greater than or equal to 2.
// @visibility drawing
//<
setNumMinorTicks : function (numMinorTicks) {
    numMinorTicks = Math.floor(numMinorTicks);
    if (this.numMinorTicks != numMinorTicks) {
        numMinorTicks = Math.max(0, numMinorTicks);
        if (numMinorTicks != 0) {
            numMinorTicks = Math.max(2, numMinorTicks);
        }
        this.numMinorTicks = numMinorTicks;
        this._makeItems();
    }
},

//> @method gauge.setLabelPrefix()
// Sets the +link{Gauge.labelPrefix,labelPrefix} property and re-creates all sector labels.
//
// @param labelPrefix (String) the new label prefix.
// @visibility drawing
//<
setLabelPrefix : function (labelPrefix) {
    if (labelPrefix == null) labelPrefix = "";
    if (this.labelPrefix != labelPrefix) {
        this.labelPrefix = labelPrefix;
        this.reformatLabelContents();
    }
},

//> @method gauge.setLabelSuffix()
// Sets the +link{Gauge.labelSuffix,labelSuffix} property and re-creates all sector labels.
//
// @param labelSuffix (String) the new label suffix.
// @visibility drawing
//<
setLabelSuffix : function (labelSuffix) {
    if (labelSuffix == null) labelSuffix = "";
    if (this.labelSuffix != labelSuffix) {
        this.labelSuffix = labelSuffix;
        this.reformatLabelContents();
    }
},

//> @method gauge.setDrawnClockwise()
// Sets the +link{gauge.drawnClockwise, drawnClockwise} property and redraws the gauge.
//
// @param drawnClockwise (boolean) whether the sectors are drawn clockwise.
// @visibility drawing
//<
setDrawnClockwise : function (drawnClockwise) {
    drawnClockwise = !!drawnClockwise;
    if (this.drawnClockwise != drawnClockwise) {
        this.drawnClockwise = drawnClockwise;
        this._makeItems();
    }
},

//> @method gauge.formatLabelContents() (A)
// Formats a value as a string to be used as the contents of a +link{DrawLabel}. The default
// implementation prepends +link{gauge.labelPrefix, labelPrefix} and appends
// +link{gauge.labelSuffix, labelSuffix} to <code>value</code>.
// <p>
// <b>NOTE:</b> If a subclass overrides this, then whenever it changes the way that values are
// formatted, it must call +link{Gauge.reformatLabelContents()}.
//
// @param value (float) the value to format.
// @return (string) label contents.
// @visibility drawing
//<
formatLabelContents : function (value) {
    return this.labelPrefix + (0 + value) + this.labelSuffix;
},

//> @method gauge.reformatLabelContents() (A)
// Resets the contents of all labels. This involves calling +link{Gauge.formatLabelContents()}
// to get the label contents for each corresponding value and repositioning the label.
//
// @visibility drawing
//<
reformatLabelContents : function () {
    this._makeItems();
},

//> @method gauge.getNumSectors()
// Gets the number of sectors.
//
// @return (int) the number of sectors on this gauge.
// @visibility drawing
//<
getNumSectors : function () {
    return this.sectors.length;
},

//> @method gauge.getSectorValue()
// Gets the value of the sector at <code>sectorIndex</code>.
//
// @param sectorIndex (int) index of the target sector.
// @return (float) the value of the sector at <code>sectorIndex</code>.
// @visibility drawing
//<
getSectorValue : function (sectorIndex) {
    return this.sectors[sectorIndex].value;
},

//> @method gauge.getDefaultFillColor() (A)
// Gets the default fill color for the sector at index <code>sectorIndex</code>. The default
// implementation cycles through +link{gauge.sectorColors, sectorColors}
// using modular arithmetic.
//
// @param sectorIndex (int) index of the target sector.
// @return (CSSColor) a fill color.
// @visibility drawing
//<
getDefaultFillColor : function (sectorIndex) {
    var numDefaultColors = this.sectorColors.length;
    return this.sectorColors[sectorIndex % numDefaultColors];
},

//> @method gauge.getSectorFillColor()
// Gets the fill color of the sector at index <code>sectorIndex</code>.
//
// @param sectorIndex (int) index of the target sector.
// @return (CSSColor) the fill color of the sector at <code>sectorIndex</code>.
// @see DrawItem.fillColor
// @visibility drawing
//<
getSectorFillColor : function (sectorIndex) {
    return this.sectors[sectorIndex].fillColor;
},

//> @method gauge.setSectorFillColor()
// Sets the fill color of the sector at <code>sectorIndex</code>.
//
// @param sectorIndex (int) index of the target sector.
// @param fillColor (CSSColor) the new fill color.
// @see DrawItem.setFillColor
// @visibility drawing
//<
setSectorFillColor : function (sectorIndex, fillColor) {
    var sectors = this.sectors;
    var drawSectors = this._drawSectors;

    sectors[sectorIndex].fillColor = fillColor;

    if (drawSectors && drawSectors.length == sectors.length) {
        drawSectors[sectorIndex].setFillColor(fillColor);
    } else {
        this._makeItems();
    }
},

// Shift fill colors left by one - when new sector has no specified color
_shiftSectorFillColor : function (sector, index) {
    if (index < this.sectors.length) {
        sector.fillColor = this.sectors[index].fillColor;
    } else {
        sector.fillColor = this.getDefaultFillColor(index);
    }
},

//> @method gauge.getSectorLabelContents()
// Gets the label contents of the label for the sector at sectorIndex.
//
// @param sectorIndex (int) index of the target sector.
// @return (String) the label contents of the sector's label.
// @visibility drawing
//<
getSectorLabelContents : function (sectorIndex) {
    return this.formatLabelContents(this.sectors[sectorIndex].value);
},

//> @method gauge.setBorderColor()
// Sets the border color for this gauge.
//
// @param color (CSSColor) color of the gauge border
//<
setBorderColor : function (color) {
    this.borderColor = color;
    this.redraw();
},

//> @method gauge.setBorderWidth()
// Sets the border width for this gauge.
//
// @param color (int) width of the gauge border
//<
setBorderWidth : function (width) {
    this.borderWidth = width;
    this.redraw();
},

//> @method gauge.setSectors()
// Sets the sectors for this gauge.
// @param (Array of GaugeSector) the sectors to show on the gauge.
// @visibility drawing
//<
setSectors : function (sectors) {
    this.sectors = [];
    for (var i = 0; i < sectors.length; i++) {
        this.addSector(sectors[i], true);
    }

    this._makeItems();
},

//> @method gauge.addSector()
// Adds a new sector.
//
// @param newSector (GaugeSector | double) the new GaugeSector or the new sector's value. This
// is formatted with +link{Gauge.formatLabelContents()} to get its label.
// @return (int) the index of the newly-added sector.
// @visibility drawing
//<
addSector : function (newSector, dontMakeItems) {
    if (!isc.isAn.Object(newSector)) {
        newSector = { value: newSector };
    }

    var value = newSector.value;

    // Apply sector defaults.
    newSector = isc.addProperties({}, this.sectorDefaults, newSector);

    // Ensure that `value` is between the min value and the max value.
    value = Math.min(Math.max(0 + value, this.minValue), this.maxValue);

    var sectors = this.sectors;
    var maxValue = this.maxValue;
    var minValue = this.minValue;

    var newSectorIndex = 0;

    // Determine where the new GaugeSector object should go in `this.sectors`.
    for (; newSectorIndex < sectors.length &&
           sectors[newSectorIndex].value < value; ++newSectorIndex)
    {
        /*empty*/
    }

    var tmp = new Array(sectors.length + 1);
    for (var sectorIndex = 0; sectorIndex < newSectorIndex; ++sectorIndex) {
        tmp[sectorIndex] = sectors[sectorIndex];
    }

    var prevEndAngle,
        scale = maxValue - minValue,
        shiftSectorColors = !newSector.fillColor;

    newSector.startAngle = this._getSectorStartAngle(newSectorIndex, minValue, scale);
    newSector.endAngle = prevEndAngle = this._getSectorEndAngle(value, minValue, scale);
    tmp[newSectorIndex] = newSector;

    if (shiftSectorColors) this._shiftSectorFillColor(newSector, newSectorIndex);

    if (newSectorIndex < sectors.length) {
        sectors[newSectorIndex].startAngle = prevEndAngle;
    }

    for (var sectorIndex = newSectorIndex; sectorIndex < sectors.length; ++sectorIndex) {
        var sector = sectors[sectorIndex];

        // Continue shifting sector fill colors left by one.
        if (shiftSectorColors) this._shiftSectorFillColor(sector, sectorIndex+1);

        tmp[sectorIndex + 1] = sector;
    }

    this.sectors = sectors = tmp;

    if (!dontMakeItems) {
        this._makeItems();
    }

    return newSectorIndex;
},

//> @method gauge.removeSector()
// Removes the sector at sectorIndex.
// <p>
// <b>NOTE:</b> There must always be one sector and it is not possible to remove the sole remaining
// sector. Calling this method to attempt to remove the sole remaining sector is a no-op.
//
// @param sectorIndex (int) the index of the sector to remove.
// @visibility drawing
//<
removeSector : function (sectorIndex) {
    var sectors = this.sectors;

    if (sectorIndex == 0 && sectors.length == 1) {
        return;
    }

    var tmp = new Array(sectors.length - 1);

    for (var i = 0; i < sectorIndex; ++i) {
        tmp[i] = sectors[i];
    }

    var prevEndAngle = 0;
    if (sectorIndex > 0) {
        prevEndAngle = sectors[sectorIndex - 1].endAngle;
    }

    if (sectorIndex < sectors.length - 1) {
        sectors[sectorIndex + 1].startAngle = prevEndAngle;
    }

    for (var i = sectorIndex + 1; i < sectors.length; ++i) {
        tmp[i - 1] = sectors[i];
    }

    if (sectorIndex == sectors.length - 1) {
        tmp[sectorIndex - 1].endAngle = 180;
        tmp[sectorIndex - 1].value = this.maxValue;
    }

    this.sectors = sectors = tmp;

    this._makeItems();
},

_getSectorStartAngle : function (sectorIndex, minValue, scale) {
    if (sectorIndex == 0) {
        return 0;
    } else {
        var prevSectorValue = this.sectors[sectorIndex - 1].value;
        return 180 * (prevSectorValue - minValue) / scale;
    }
},

_getSectorEndAngle : function (value, minValue, scale) {
    return 180 * (value - minValue) / scale;
},

_positionNeedleTriangle : function (value) {


    var pivotPoint = this.pivotPoint;

    var scale = this.maxValue - this.minValue;
    var angleRad = Math.PI - Math.PI * (value - this.minValue) / scale;
    if (!this.drawnClockwise) {
        angleRad = Math.PI - angleRad;
    }

    // The outermost point of the needle triangle (in polar coordinates with the origin at
    // `pivotPoint`) has r = this.dialRadius - 15.

    // Compute the Cartesian coordinates of the outermost point, with the origin being
    // `pivotPoint`.
    var x = (this.dialRadius - 15) * Math.cos(angleRad);
    var y = (this.dialRadius - 15) * Math.sin(angleRad);
    // Translate to Drawing coordinates.
    var p = [ pivotPoint[0] + x, pivotPoint[1] - y ];

    // `p1` and `p2` are points on the center knob. The line segment from `p1` to `p2` is
    // perpendicular to the line segment (0, 0) to `p`.
    // The math is the same. It's just that the angles are different (+/- Pi/2, or 90 deg) and
    // r is this.knobRadius.
    var angleRad1 = angleRad - Math.PI / 2.0;
    var x1 = this.knobRadius * Math.cos(angleRad1);
    var y1 = this.knobRadius * Math.sin(angleRad1);
    var p1 = [ pivotPoint[0] + x1, pivotPoint[1] - y1 ];

    var angleRad2 = angleRad + Math.PI / 2.0;
    var x2 = this.knobRadius * Math.cos(angleRad2);
    var y2 = this.knobRadius * Math.sin(angleRad2);
    var p2 = [ pivotPoint[0] + x2, pivotPoint[1] - y2 ];

    this._needleTriangle.setPoints([ p, p1, p2 ]);
},

_makePositionedLabel : function (contents, value) {


    var pivotPoint = this.pivotPoint;

    var scale = this.maxValue - this.minValue;
    var angleRad = Math.PI - Math.PI * (value - this.minValue) / scale;
    if (!this.drawnClockwise) {
        angleRad = Math.PI - angleRad;
    }

    var labelProps = {
        fontSize: this.fontSize,
        contents: contents,
        left: 0,
        top: 0
    };
    var labelDims = this.measureLabel(contents, labelProps),
        labelWidth = labelDims.width,
        labelHeight = labelDims.height;

    var x = (this.dialRadius + 5) * Math.cos(angleRad);
    var y = (this.dialRadius + 5) * Math.sin(angleRad);

    var left;
    if (angleRad < 9.0 * Math.PI / 20.0 - 0.001) {
        // (x, y) are the Cartesian coordinates of the bottom left point of the label, where
        // the origin is `pivotPoint`.
        left = Math.round(pivotPoint[0] + x + 2);
    } else if (angleRad <= 11.0 * Math.PI / 20.0 + 0.001) {
        // (x, y) are the Cartesian coordinates of the bottom middle point of the label, where
        // the origin is `pivotPoint`.
        left = Math.round(pivotPoint[0] + x - labelWidth / 2);
    } else {
        // (x, y) are the Cartesian coordinates of the bottom right point of the label, where
        // the origin is `pivotPoint`.
        left = Math.round(pivotPoint[0] + x - labelWidth - 2);
    }

    var top;
    if (Math.PI / 4.0 <= angleRad &&
        angleRad <= 3.0 * Math.PI / 4.0) {
        top = Math.round(pivotPoint[1] - y - labelHeight * (1.0 - Math.abs(Math.PI / 2.0 - angleRad) * 0.5));
    } else {
        top = Math.round(pivotPoint[1] - y - labelHeight / 2);
    }

    labelProps.left = left;
    labelProps.top = top;
    return isc.DrawLabel.create(labelProps);
}
});
isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Drawing');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Drawing_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Drawing module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'Drawing', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Drawing'.");}

/*

  SmartClient Ajax RIA system
  Version SNAPSHOT_v10.0d_2014-05-06/LGPL Deployment (2014-05-06)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

