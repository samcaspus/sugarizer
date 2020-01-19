    // Code To handle Export To ODT Feature

    var count = 0;
    var pcount = 0;

    function rgbToHex(a){
    a=a.replace(/[^\d,]/g,"").split(","); 
    return"#"+((1<<24)+(+a[0]<<16)+(+a[1]<<8)+ +a[2]).toString(16).slice(1)
    }

    function resetXML(){
    xml = xmlinitialcopy ;
    automaticstyles = automaticstylesinitialcopy ;
    }

    function traverse(ancestor){
    var childnodes = ancestor.childNodes ;
    for(var i = 0 ; i < childnodes.length ; i++){
        if(childnodes[i].tagName=='P'){
            xml=xml+'\n';
        }
        if(childnodes[i].tagName){
            if(childnodes[i].tagName == 'IMG'){
                var width = childnodes[i].clientWidth*0.0264;
                var h = childnodes[i].clientHeight*0.0264;
                var testStr = childnodes[i];
                var src = testStr.src;
                var splitStr = src.substring(src.indexOf(',') + 1);
                var img = '';
                if(childnodes[i].parentNode.tagName == 'P'){
                    img = img + '</text:p>';
                }
                img += '<text:p><draw:frame draw:style-name="fr1" draw:name="Picture" text:anchor-type="char" svg:width="'+width+'cm" svg:height="'+h+'cm" draw:z-index="0"><draw:image loext:mime-type="image/jpeg">'
                            +'<office:binary-data>'
                            +splitStr
                            +'</office:binary-data>'
                            +'</draw:image>'
                            +'</draw:frame>'
                img = img + '</text:p><text:p>';
                xml=xml+img;

            } else if(childnodes[i].tagName == 'UL' || childnodes[i].tagName == 'OL' || childnodes[i].tagName == 'LI'){
                var tagName = childnodes[i].tagName.toLowerCase();
                var style = '';
                var addstyle = '';
                if(tagName=='ol'){
                    xml=xml+'\n <text:list xml:id="" text:style-name="L1"> ';
                    traverse(childnodes[i]);
                    xml=xml+'\n </text:list> ';
                }
                if(tagName=='ul'){
                    xml=xml+'\n <text:list xml:id="" text:style-name="L2"> ';
                    traverse(childnodes[i]);
                    xml=xml+'\n </text:list> ';
                }
                if(tagName=='li'){
                    var classname = childnodes[i].className ;
                    if(classname.length>1){
                        classname = classname.substring(9,classname.length);
                        if(classname=='right') classname = 'end';
                        if(classname=='left') classname = 'start';
                            
                        style = '<style:style style:name="P'+pcount+'" style:family="paragraph" style:parent-style-name="Text_20_body">'
                        +'<style:paragraph-properties fo:margin-top="0cm" fo:margin-bottom="0.397cm" loext:contextual-spacing="false" fo:text-align="'+classname+'" style:justify-single-word="false" fo:orphans="2" fo:widows="2" fo:padding="0cm" fo:border="none"';
                        pcount++;
                        style = style + '/>' + '</style:style>';
                        automaticstyles+=style;
                        var c = (pcount-1).toString();
                        addstyle='text:style-name="P'+c+'"';
                    }
                    xml = xml + '\n<text:list-item>'
                    xml = xml + '<text:p '+addstyle+'>'
                    if(childnodes[i].childNodes[0].tagName == 'SPAN') {
                        traverse(childnodes[i]);
                    }
                    else {
                        xml = xml + childnodes[i].textContent ;
                    }
                    xml = xml + '</text:p></text:list-item>'
                }
            } else {

                var style = '';
                var addstyle = '';
                var tagName = childnodes[i].tagName.toLowerCase();
                if(childnodes[i].style){
                    style = '<style:style style:name="T'+count+'" style:family="text">\n'+'<style:text-properties ';
                    count++;
                    var htmlStyles = childnodes[i].style;
                    if(htmlStyles.color){
                        var color = rgbToHex(htmlStyles.color);
                        style = style + ' fo:color="'+color+'" ';
                    }
                    if(htmlStyles.backgroundColor){
                        var color = rgbToHex(htmlStyles.backgroundColor);
                        style = style + ' fo:background-color="'+color+'" ';
                    }
                    if(htmlStyles.fontSize){
                        var size = htmlStyles.fontSize;
                        size = size.substring(0,size.indexOf("p"));
                        size=size*0.75;
                        style = style + ' fo:font-size="'+size+'pt" ';
                    }
                    if(childnodes[i].className){
                        var classname = childnodes[i].className ;
                        if(classname.length > 1){
                            classname = classname.substring(8,classname.length);
                            if(classname=="arial"){
                                style = style + ' style:font-name="Arial" ';
                            }
                            if(classname=="comic"){
                                style = style + ' style:font-name="Comic Sans MS" ';
                            }
                            if(classname=="Verdana"){
                                style = style + ' style:font-name="Verdana" ';
                            }
                            if(classname=="Times"){
                                style = style + ' style:font-name="Times New Roman" ';
                            }
                            if(classname=="Courier"){
                                style = style + ' style:font-name="Courier" ';
                            }
                            if(classname=="Lucida"){
                                style = style + ' style:font-name="Lucida Grande" ';
                            }
                            if(classname=="Impact"){
                                style = style + ' style:font-name="Impact" ';
                            }
                            if(classname=="Georgia"){
                                style = style + ' style:font-name="Georgia" ';
                            }
                        }
                    }
                    if(tagName=='p'){
                        var classname = childnodes[i].className ;
                        if(classname.length>1){
                            classname = classname.substring(9,classname.length);
                            if(classname=='right') classname = 'end';
                            if(classname=='left') classname = 'start';
                                
                            style = '<style:style style:name="P'+pcount+'" style:family="paragraph" style:parent-style-name="Text_20_body">'
                            +'<style:paragraph-properties fo:margin-top="0cm" fo:margin-bottom="0.397cm" loext:contextual-spacing="false" fo:text-align="'+classname+'" style:justify-single-word="false" fo:orphans="2" fo:widows="2" fo:padding="0cm" fo:border="none"';
                            pcount++;
                        }
                    }
                    if(tagName=='strong'){
                        style = style + ' fo:font-weight="bold" ';
                    }
                    if(tagName=='em'){
                        style = style + ' fo:font-style="italic" ';
                    }
                    if(tagName=='u'){
                        style = style + ' style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color" ';
                    }
                    if(tagName=='s'){
                        style = style + ' style:text-line-through-style="solid" style:text-line-through-type="single"  ';
                    }
                    style = style + '/>' + '</style:style>';
                    if(tagName=='p' && style.length>100){ automaticstyles+=style;  var c = (pcount-1).toString(); addstyle='text:style-name="P'+c+'"'; }
                    if(style.length>89 && tagName!='p')
                    {automaticstyles+=style;  var c = (count-1).toString(); addstyle='text:style-name="T'+c+'"'; }
                }
                if(tagName=='strong') tagName='span';
                if(tagName=='em') tagName='span';
                if(tagName=='u') tagName='span';
                if(tagName=='s') tagName='span';
                xml = xml+'<text:'+tagName+' '+addstyle+'>';
                if(childnodes[i].childNodes.length>1 || childnodes[i].childNodes[0].tagName == 'SPAN' || childnodes[i].childNodes[0].tagName == 'IMG' || childnodes[i].childNodes[0].tagName == 'U' || childnodes[i].childNodes[0].tagName == 'S' || childnodes[i].childNodes[0].tagName == 'STRONG' || childnodes[i].childNodes[0].tagName == 'EM'){
                    traverse(childnodes[i]);
                    xml = xml+'</text:'+tagName+'>';
                } else {
                    xml = xml+childnodes[i].textContent;
                    xml = xml+'</text:'+tagName+'>';
                }
            }
            
        } else {
            xml = xml + '<text:span>' + childnodes[i].textContent + ' </text:span>'
        }
        
    }
    return header+officestyles+automaticstyles+automaticstylesend+xml+footer;
    }

    var header = '<?xml version="1.0" encoding="UTF-8"?>' 
    + '<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0" xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0" xmlns:math="http://www.w3.org/1998/Math/MathML" xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0" xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0" xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0" xmlns:ooo="http://openoffice.org/2004/office" xmlns:ooow="http://openoffice.org/2004/writer" xmlns:oooc="http://openoffice.org/2004/calc" xmlns:dom="http://www.w3.org/2001/xml-events" xmlns:xforms="http://www.w3.org/2002/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:rpt="http://openoffice.org/2005/report" xmlns:of="urn:oasis:names:tc:opendocument:xmlns:of:1.2" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:grddl="http://www.w3.org/2003/g/data-view#" xmlns:officeooo="http://openoffice.org/2009/office" xmlns:tableooo="http://openoffice.org/2009/table" xmlns:drawooo="http://openoffice.org/2010/draw" xmlns:calcext="urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0" xmlns:loext="urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0" xmlns:field="urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0" xmlns:formx="urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0" xmlns:css3t="http://www.w3.org/TR/css3-text/" office:version="1.2" office:mimetype="application/vnd.oasis.opendocument.text">'
    + ' <office:meta><meta:creation-date>2017-08-02T11:09:18</meta:creation-date><dc:language>en-US</dc:language><meta:editing-cycles>1</meta:editing-cycles><meta:editing-duration>P2171DT9H31M46S</meta:editing-duration><meta:generator>LibreOffice/6.2.5.2$MacOSX_X86_64 LibreOffice_project/1ec314fa52f458adc18c4f025c545a4e8b22c159</meta:generator><dc:date>2019-08-09T16:43:46.820976332</dc:date><meta:document-statistic meta:table-count="0" meta:image-count="1" meta:object-count="0" meta:page-count="1" meta:paragraph-count="3" meta:word-count="11" meta:character-count="52" meta:non-whitespace-character-count="42"/></office:meta>'
    + '<office:settings>'
    + '<config:config-item-set config:name="ooo:view-settings">'
    + '<config:config-item config:name="ViewAreaTop" config:type="long">0</config:config-item>'
    + '<config:config-item config:name="ViewAreaLeft" config:type="long">0</config:config-item>'
    + '<config:config-item config:name="ViewAreaWidth" config:type="long">27326</config:config-item>'
    + '<config:config-item config:name="ViewAreaHeight" config:type="long">13060</config:config-item>'
    + '<config:config-item config:name="ShowRedlineChanges" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="InBrowseMode" config:type="boolean">false</config:config-item>'
    + '<config:config-item-map-indexed config:name="Views">'
    + '<config:config-item-map-entry>'
    + '<config:config-item config:name="ViewId" config:type="string">view2</config:config-item>'
    + '<config:config-item config:name="ViewLeft" config:type="long">13663</config:config-item>'
    + '<config:config-item config:name="ViewTop" config:type="long">21239</config:config-item>'
    + '<config:config-item config:name="VisibleLeft" config:type="long">0</config:config-item>'
    + '<config:config-item config:name="VisibleTop" config:type="long">0</config:config-item>'
    + '<config:config-item config:name="VisibleRight" config:type="long">27324</config:config-item>'
    + '<config:config-item config:name="VisibleBottom" config:type="long">13058</config:config-item>'
    + '<config:config-item config:name="ZoomType" config:type="short">0</config:config-item>'
    + '<config:config-item config:name="ViewLayoutColumns" config:type="short">0</config:config-item>'
    + '<config:config-item config:name="ViewLayoutBookMode" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ZoomFactor" config:type="short">100</config:config-item>'
    + '<config:config-item config:name="IsSelectedFrame" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="AnchoredTextOverflowLegacy" config:type="boolean">true</config:config-item>'
    + '</config:config-item-map-entry>'
    + '</config:config-item-map-indexed>'
    + '</config:config-item-set>'
    + '<config:config-item-set config:name="ooo:configuration-settings">'
    + '<config:config-item config:name="PrintControls" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintPageBackground" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintAnnotationMode" config:type="short">0</config:config-item>'
    + '<config:config-item config:name="PrintGraphics" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintLeftPages" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintProspect" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrintRightPages" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintFaxName" config:type="string"/>'
    + '<config:config-item config:name="PrintPaperFromSetup" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrintTextPlaceholder" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="EmptyDbFieldHidesPara" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ApplyParagraphMarkFormatToNumbering" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintReversed" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="TabOverMargin" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="EmbedAsianScriptFonts" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="EmbedLatinScriptFonts" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="DisableOffPagePositioning" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="EmbedOnlyUsedFonts" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="EmbedFonts" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="SurroundTextWrapSmall" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="BackgroundParaOverDrawings" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="ClippedPictures" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="FloattableNomargins" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="UnbreakableNumberings" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="EmbedSystemFonts" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="TabOverflow" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintTables" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintSingleJobs" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="SmallCapsPercentage66" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="CollapseEmptyCellPara" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="RsidRoot" config:type="int">1661783</config:config-item>'
    + '<config:config-item config:name="PrinterSetup" config:type="base64Binary"/>'
    + '<config:config-item config:name="CurrentDatabaseCommand" config:type="string"/>'
    + '<config:config-item config:name="ClipAsCharacterAnchoredWriterFlyFrames" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="DoNotCaptureDrawObjsOnPage" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="CurrentDatabaseCommandType" config:type="int">0</config:config-item>'
    + '<config:config-item config:name="LoadReadonly" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="DoNotResetParaAttrsForNumFont" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="StylesNoDefault" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AlignTabStopPosition" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="LinkUpdateMode" config:type="short">1</config:config-item>'
    + '<config:config-item config:name="DoNotJustifyLinesWithManualBreak" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PropLineSpacingShrinksFirstLine" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ConsiderTextWrapOnObjPos" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="TabAtLeftIndentForParagraphsInList" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="RedlineProtectionKey" config:type="base64Binary"/>'
    + '<config:config-item config:name="UnxForceZeroExtLeading" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrintDrawings" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="UseFormerTextWrapping" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ProtectForm" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="UseFormerLineSpacing" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="CurrentDatabaseDataSource" config:type="string"/>'
    + '<config:config-item config:name="AllowPrintJobCancel" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="SubtractFlysAnchoredAtFlys" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AddParaSpacingToTableCells" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AddExternalLeading" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AddVerticalFrameOffsets" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="TreatSingleColumnBreakAsPageBreak" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="MathBaselineAlignment" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AddFrameOffsets" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="IsLabelDocument" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="MsWordCompTrailingBlanks" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrinterPaperFromSetup" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="IgnoreFirstLineIndentInNumbering" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="OutlineLevelYieldsNumbering" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrinterName" config:type="string"/>'
    + '<config:config-item config:name="IsKernAsianPunctuation" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrinterIndependentLayout" config:type="string">high-resolution</config:config-item>'
    + '<config:config-item config:name="PrintBlackFonts" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="TableRowKeep" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="UpdateFromTemplate" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="SaveThumbnail" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="EmbeddedDatabaseName" config:type="string"/>'
    + '<config:config-item config:name="Rsid" config:type="int">1859262</config:config-item>'
    + '<config:config-item config:name="TabsRelativeToIndent" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="EmbedComplexScriptFonts" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="UseOldPrinterMetrics" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="IgnoreTabsAndBlanksForLineCalculation" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="InvertBorderSpacing" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="SaveGlobalDocumentLinks" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrintProspectRTL" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="PrintEmptyPages" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ApplyUserData" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="PrintHiddenText" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="AddParaTableSpacingAtStart" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="SaveVersionOnClose" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="CharacterCompressionType" config:type="short">0</config:config-item>'
    + '<config:config-item config:name="UseOldNumbering" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="FieldAutoUpdate" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="UseFormerObjectPositioning" config:type="boolean">false</config:config-item>'
    + '<config:config-item config:name="ChartAutoUpdate" config:type="boolean">true</config:config-item>'
    + '<config:config-item config:name="AddParaTableSpacing" config:type="boolean">false</config:config-item>'
    + '</config:config-item-set>'
    + '</office:settings>'
    + '<office:scripts>'
    + '<office:script script:language="ooo:Basic">'
    + '<ooo:libraries xmlns:ooo="http://openoffice.org/2004/office" xmlns:xlink="http://www.w3.org/1999/xlink">'
    + '<ooo:library-embedded ooo:name="Standard"/>'
    + '</ooo:libraries>'
    + '</office:script>'
    + '</office:scripts>'
    + '<office:font-face-decls>'
    + '<style:font-face style:name="OpenSymbol1" svg:font-family="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-charset="x-symbol"/>'
    + '<style:font-face style:name="FreeSans1" svg:font-family="FreeSans" style:font-family-generic="swiss"/>'
    + '<style:font-face style:name="OpenSymbol" svg:font-family="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-family-generic="roman" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Symbol" svg:font-family="Symbol" style:font-family-generic="roman" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Comic Sans MS" svg:font-family="&apos;Comic Sans MS&apos;" style:font-family-generic="script" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Courier" svg:font-family="Courier" style:font-family-generic="modern" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Times New Roman" svg:font-family="&apos;Times New Roman&apos;" style:font-family-generic="roman" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Georgia" svg:font-family="Georgia" style:font-family-generic="roman" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Lucida Grande" svg:font-family="&apos;Lucida Grande&apos;" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Impact" svg:font-family="Impact" style:font-family-generic="swiss" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Arial" svg:font-family="Arial" style:font-family-generic="swiss" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Liberation Sans" svg:font-family="&apos;Liberation Sans&apos;, Arial" style:font-family-generic="swiss" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Verdana" svg:font-family="Verdana" style:font-family-generic="swiss" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Open Sans1" svg:font-family="&apos;Open Sans&apos;, Arial" style:font-family-generic="system" style:font-pitch="variable"/>'
    + '<style:font-face style:name="OpenSymbol3" svg:font-family="OpenSymbol" style:font-family-generic="system" style:font-pitch="variable"/>'
    + '<style:font-face style:name="OpenSymbol2" svg:font-family="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-family-generic="system" style:font-pitch="variable"/>'
    + '<style:font-face style:name="Symbol1" svg:font-family="Symbol" style:font-family-generic="system" style:font-pitch="variable"/>'
    + '</office:font-face-decls>'   ;

    var automaticstyles = '<office:automatic-styles>' 
    +'<style:style style:name="fr1" style:family="graphic" style:parent-style-name="Graphics">'
    +'<style:graphic-properties fo:margin-left="0cm" fo:margin-right="0cm" fo:margin-top="0cm" fo:margin-bottom="0cm" style:wrap="none" style:number-wrapped-paragraphs="no-limit" style:wrap-contour="false" style:vertical-pos="top" style:vertical-rel="paragraph" style:horizontal-pos="center" style:horizontal-rel="paragraph" fo:background-color="transparent" draw:fill="none" draw:fill-color="#ffffff" fo:padding="0cm" fo:border="none" style:mirror="none" fo:clip="rect(0cm, 0cm, 0cm, 0cm)" draw:luminance="0%" draw:contrast="0%" draw:red="0%" draw:green="0%" draw:blue="0%" draw:gamma="100%" draw:color-inversion="false" draw:image-opacity="100%" draw:color-mode="standard" style:flow-with-text="true"/>'
    +'</style:style>'
    +'<text:list-style style:name="L1">'
    +'<text:list-level-style-number text:level="1" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="2" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.905cm" fo:text-indent="-0.635cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="3" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-0.635cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="4" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.175cm" fo:text-indent="-0.635cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="5" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.81cm" fo:text-indent="-0.635cm" fo:margin-left="3.81cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="6" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="4.445cm" fo:text-indent="-0.635cm" fo:margin-left="4.445cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="7" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.08cm" fo:text-indent="-0.635cm" fo:margin-left="5.08cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="8" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.715cm" fo:text-indent="-0.635cm" fo:margin-left="5.715cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="9" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.35cm" fo:text-indent="-0.635cm" fo:margin-left="6.35cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="10" text:style-name="Numbering_20_Symbols" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:list-style style:name="L2">'
    +'<text:list-level-style-bullet text:level="1" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="2" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.905cm" fo:text-indent="-0.635cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="3" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-0.635cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="4" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.175cm" fo:text-indent="-0.635cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="5" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.81cm" fo:text-indent="-0.635cm" fo:margin-left="3.81cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="6" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="4.445cm" fo:text-indent="-0.635cm" fo:margin-left="4.445cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="7" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.08cm" fo:text-indent="-0.635cm" fo:margin-left="5.08cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="8" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.715cm" fo:text-indent="-0.635cm" fo:margin-left="5.715cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="9" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.35cm" fo:text-indent="-0.635cm" fo:margin-left="6.35cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="10" text:style-name="Bullet_20_Symbols" text:bullet-char="●">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'</text:list-style>';

    var automaticstylesinitialcopy = automaticstyles;

    var automaticstylesend = '<style:page-layout style:name="pm1">'
    +'<style:page-layout-properties fo:page-width="21.001cm" fo:page-height="29.7cm" style:num-format="1" style:print-orientation="portrait" fo:margin-top="2cm" fo:margin-bottom="2cm" fo:margin-left="2cm" fo:margin-right="2cm" fo:background-color="#ffffff" style:writing-mode="lr-tb" style:layout-grid-color="#c0c0c0" style:layout-grid-lines="40" style:layout-grid-base-height="0.423cm" style:layout-grid-ruby-height="0.212cm" style:layout-grid-mode="none" style:layout-grid-ruby-below="false" style:layout-grid-print="false" style:layout-grid-display="false" style:layout-grid-base-width="0.37cm" style:layout-grid-snap-to="true" draw:fill="solid" draw:fill-color="#ffffff" draw:opacity="100%" style:footnote-max-height="0cm">'
    +'<style:footnote-sep style:width="0.018cm" style:distance-before-sep="0.101cm" style:distance-after-sep="0.101cm" style:line-style="solid" style:adjustment="left" style:rel-width="0%" style:color="#000000"/>'
    +'</style:page-layout-properties>'
    +'<style:header-style/>'
    +'<style:footer-style/>'
    +'</style:page-layout>'
    +'</office:automatic-styles>'
    +'<office:master-styles>'
    +'<style:master-page style:name="Standard" style:page-layout-name="pm1"/>'
    +'</office:master-styles>';

    var xml = '<office:body>' 
    +'<office:text>'
    +'<text:sequence-decls>'
    +'<text:sequence-decl text:display-outline-level="0" text:name="Illustration"/>'
    +'<text:sequence-decl text:display-outline-level="0" text:name="Table"/>'
    +'<text:sequence-decl text:display-outline-level="0" text:name="Text"/>'
    +'<text:sequence-decl text:display-outline-level="0" text:name="Drawing"/>'
    +'<text:sequence-decl text:display-outline-level="0" text:name="Figure"/>'
    +'</text:sequence-decls>';

    var xmlinitialcopy = xml ;

    var footer = '</office:text>'
    +'</office:body>'
    +'</office:document>';

    var officestyles = '<office:styles>'
    +'<style:default-style style:family="graphic">'
    +'<style:graphic-properties svg:stroke-color="#3465a4" draw:fill-color="#729fcf" fo:wrap-option="no-wrap" draw:shadow-offset-x="0.3cm" draw:shadow-offset-y="0.3cm" draw:start-line-spacing-horizontal="0.283cm" draw:start-line-spacing-vertical="0.283cm" draw:end-line-spacing-horizontal="0.283cm" draw:end-line-spacing-vertical="0.283cm" style:flow-with-text="false"/>'
    +'<style:paragraph-properties style:text-autospace="ideograph-alpha" style:line-break="strict" style:font-independent-line-spacing="false">'
    +'<style:tab-stops/>'
    +'</style:paragraph-properties>'
    +'<style:text-properties style:use-window-font-color="true" style:font-name="Liberation Serif" fo:font-size="12pt" fo:language="en" fo:country="US" style:letter-kerning="true" style:font-name-asian="Droid Sans Fallback" style:font-size-asian="12pt" style:language-asian="zh" style:country-asian="CN" style:font-name-complex="FreeSans" style:font-size-complex="12pt" style:language-complex="hi" style:country-complex="IN"/>'
    +'</style:default-style>'
    +'<style:default-style style:family="paragraph">'
    +'<style:paragraph-properties fo:hyphenation-ladder-count="no-limit" style:text-autospace="ideograph-alpha" style:punctuation-wrap="hanging" style:line-break="strict" style:tab-stop-distance="1.251cm" style:writing-mode="lr-tb"/>'
    +'<style:text-properties style:use-window-font-color="true" style:font-name="Liberation Serif" fo:font-size="12pt" fo:language="en" fo:country="US" style:letter-kerning="true" style:font-name-asian="Droid Sans Fallback" style:font-size-asian="12pt" style:language-asian="zh" style:country-asian="CN" style:font-name-complex="FreeSans" style:font-size-complex="12pt" style:language-complex="hi" style:country-complex="IN" fo:hyphenate="false" fo:hyphenation-remain-char-count="2" fo:hyphenation-push-char-count="2"/>'
    +'</style:default-style>'
    +'<style:default-style style:family="table">'
    +'<style:table-properties table:border-model="collapsing"/>'
    +'</style:default-style>'
    +'<style:default-style style:family="table-row">'
    +'<style:table-row-properties fo:keep-together="auto"/>'
    +'</style:default-style>'
    +'<style:style style:name="Standard" style:family="paragraph" style:default-outline-level="" style:class="text">'
    +'<style:paragraph-properties fo:text-align="start" style:justify-single-word="false" fo:orphans="0" fo:widows="0" fo:hyphenation-ladder-count="no-limit" style:writing-mode="lr-tb"/>'
    +'<style:text-properties fo:color="#00000a" style:font-name="Liberation Serif1" fo:font-family="&apos;Liberation Serif&apos;, &apos;Times New Roman&apos;" style:font-family-generic="roman" style:font-pitch="variable" fo:font-size="12pt" fo:language="en" fo:country="US" style:font-name-asian="Droid Sans Fallback" style:font-family-asian="&apos;Droid Sans Fallback&apos;" style:font-family-generic-asian="system" style:font-pitch-asian="variable" style:font-size-asian="12pt" style:language-asian="zh" style:country-asian="CN" style:font-name-complex="FreeSans" style:font-family-complex="FreeSans" style:font-family-generic-complex="system" style:font-pitch-complex="variable" style:font-size-complex="12pt" style:language-complex="hi" style:country-complex="IN" fo:hyphenate="false" fo:hyphenation-remain-char-count="2" fo:hyphenation-push-char-count="2"/>'
    +'</style:style>'
    +'<style:style style:name="Heading" style:family="paragraph" style:parent-style-name="Standard" style:next-style-name="Text_20_body" style:default-outline-level="" style:class="text">'
    +'<style:paragraph-properties fo:margin-top="0.423cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false" fo:keep-with-next="always"/>'
    +'<style:text-properties style:font-name="Liberation Sans" fo:font-family="&apos;Liberation Sans&apos;, Arial" style:font-family-generic="swiss" style:font-pitch="variable" fo:font-size="14pt" style:font-name-asian="Droid Sans Fallback" style:font-family-asian="&apos;Droid Sans Fallback&apos;" style:font-family-generic-asian="system" style:font-pitch-asian="variable" style:font-size-asian="14pt" style:font-name-complex="FreeSans" style:font-family-complex="FreeSans" style:font-family-generic-complex="system" style:font-pitch-complex="variable" style:font-size-complex="14pt"/>'
    +'</style:style>'
    +'<style:style style:name="Text_20_body" style:display-name="Text body" style:family="paragraph" style:parent-style-name="Standard" style:default-outline-level="" style:class="text">'
    +'<style:paragraph-properties fo:margin-top="0cm" fo:margin-bottom="0.247cm" loext:contextual-spacing="false" fo:line-height="120%"/>'
    +'</style:style>'
    +'<style:style style:name="List" style:family="paragraph" style:parent-style-name="Text_20_body" style:default-outline-level="" style:class="list">'
    +'<style:text-properties style:font-size-asian="12pt" style:font-name-complex="FreeSans1" style:font-family-complex="FreeSans" style:font-family-generic-complex="swiss"/>'
    +'</style:style>'
    +'<style:style style:name="Caption" style:family="paragraph" style:parent-style-name="Standard" style:default-outline-level="" style:class="extra">'
    +'<style:paragraph-properties fo:margin-top="0.212cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false" text:number-lines="false" text:line-number="0"/>'
    +'<style:text-properties fo:font-size="12pt" fo:font-style="italic" style:font-size-asian="12pt" style:font-style-asian="italic" style:font-name-complex="FreeSans1" style:font-family-complex="FreeSans" style:font-family-generic-complex="swiss" style:font-size-complex="12pt" style:font-style-complex="italic"/>'
    +'</style:style>'
    +'<style:style style:name="Index" style:family="paragraph" style:parent-style-name="Standard" style:default-outline-level="" style:class="index">'
    +'<style:paragraph-properties text:number-lines="false" text:line-number="0"/>'
    +'<style:text-properties style:font-size-asian="12pt" style:font-name-complex="FreeSans1" style:font-family-complex="FreeSans" style:font-family-generic-complex="swiss"/>'
    +'</style:style>'
    +'<style:style style:name="Heading_20_1" style:display-name="Heading 1" style:family="paragraph" style:parent-style-name="Heading" style:default-outline-level="1" style:list-style-name="" style:class="text">'
    +'<style:paragraph-properties fo:margin-top="0.423cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false"/>'
    +'<style:text-properties fo:font-size="18pt" fo:font-weight="bold" style:font-size-asian="18pt" style:font-weight-asian="bold" style:font-size-complex="18pt" style:font-weight-complex="bold"/>'
    +'</style:style>'
    +'<style:style style:name="Heading_20_2" style:display-name="Heading 2" style:family="paragraph" style:parent-style-name="Heading" style:default-outline-level="2" style:list-style-name="" style:class="text">'
    +'<style:paragraph-properties fo:margin-top="0.353cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false"/>'
    +'<style:text-properties fo:font-size="16pt" fo:font-weight="bold" style:font-size-asian="16pt" style:font-weight-asian="bold" style:font-size-complex="16pt" style:font-weight-complex="bold"/>'
    +'</style:style>'
    +'<style:style style:name="Heading_20_3" style:display-name="Heading 3" style:family="paragraph" style:parent-style-name="Heading" style:default-outline-level="3" style:list-style-name="" style:class="text">'
    +'<style:paragraph-properties fo:margin-top="0.247cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false"/>'
    +'<style:text-properties fo:color="#808080" fo:font-size="14pt" fo:font-weight="bold" style:font-size-asian="14pt" style:font-weight-asian="bold" style:font-size-complex="14pt" style:font-weight-complex="bold"/>'
    +'</style:style>'
    +'<style:style style:name="Quotations" style:family="paragraph" style:parent-style-name="Standard" style:default-outline-level="" style:class="html">'
    +'<style:paragraph-properties fo:margin-left="1cm" fo:margin-right="1cm" fo:margin-top="0cm" fo:margin-bottom="0.499cm" loext:contextual-spacing="false" fo:text-indent="0cm" style:auto-text-indent="false"/>'
    +'</style:style>'
    +'<style:style style:name="Title" style:family="paragraph" style:parent-style-name="Heading" style:default-outline-level="" style:class="chapter">'
    +'<style:paragraph-properties fo:text-align="center" style:justify-single-word="false"/>'
    +'<style:text-properties fo:font-size="28pt" fo:font-weight="bold" style:font-size-asian="28pt" style:font-weight-asian="bold" style:font-size-complex="28pt" style:font-weight-complex="bold"/>'
    +'</style:style>'
    +'<style:style style:name="Subtitle" style:family="paragraph" style:parent-style-name="Heading" style:default-outline-level="" style:class="chapter">'
    +'<style:paragraph-properties fo:margin-top="0.106cm" fo:margin-bottom="0.212cm" loext:contextual-spacing="false" fo:text-align="center" style:justify-single-word="false"/>'
    +'<style:text-properties fo:font-size="18pt" style:font-size-asian="18pt" style:font-size-complex="18pt"/>'
    +'</style:style>'
    +'<style:style style:name="Table_20_Contents" style:display-name="Table Contents" style:family="paragraph" style:parent-style-name="Standard" style:default-outline-level="" style:class="extra">'
    +'<style:paragraph-properties text:number-lines="false" text:line-number="0"/>'
    +'</style:style>'
    +'<style:style style:name="Table_20_Heading" style:display-name="Table Heading" style:family="paragraph" style:parent-style-name="Table_20_Contents" style:default-outline-level="" style:class="extra">'
    +'<style:paragraph-properties fo:text-align="center" style:justify-single-word="false" text:number-lines="false" text:line-number="0"/>'
    +'<style:text-properties fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold"/>'
    +'</style:style>'
    +'<style:style style:name="WW8Num1z0" style:family="text"/>'
    +'<style:style style:name="WW8Num1z1" style:family="text"/>'
    +'<style:style style:name="WW8Num1z2" style:family="text"/>'
    +'<style:style style:name="WW8Num1z3" style:family="text"/>'
    +'<style:style style:name="WW8Num1z4" style:family="text"/>'
    +'<style:style style:name="WW8Num1z5" style:family="text"/>'
    +'<style:style style:name="WW8Num1z6" style:family="text"/>'
    +'<style:style style:name="WW8Num1z7" style:family="text"/>'
    +'<style:style style:name="WW8Num1z8" style:family="text"/>'
    +'<style:style style:name="WW8Num2z0" style:family="text">'
    +'<style:text-properties style:font-name="Symbol" fo:font-family="Symbol" style:font-family-generic="roman" style:font-pitch="variable" style:font-name-complex="OpenSymbol2" style:font-family-complex="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="WW8Num2z1" style:family="text">'
    +'<style:text-properties style:font-name="OpenSymbol" fo:font-family="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-family-generic="roman" style:font-pitch="variable" style:font-name-complex="OpenSymbol2" style:font-family-complex="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="Bullet_20_Symbols" style:display-name="Bullet Symbols" style:family="text">'
    +'<style:text-properties style:font-name="OpenSymbol1" fo:font-family="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-charset="x-symbol" style:font-name-asian="OpenSymbol1" style:font-family-asian="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-charset-asian="x-symbol" style:font-name-complex="OpenSymbol1" style:font-family-complex="OpenSymbol, &apos;Arial Unicode MS&apos;" style:font-charset-complex="x-symbol"/>'
    +'</style:style>'
    +'<style:style style:name="Internet_20_link" style:display-name="Internet link" style:family="text">'
    +'<style:text-properties fo:color="#000080" fo:language="zxx" fo:country="none" style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color" style:language-asian="zxx" style:country-asian="none" style:language-complex="zxx" style:country-complex="none"/>'
    +'</style:style>'
    +'<style:style style:name="Visited_20_Internet_20_Link" style:display-name="Visited Internet Link" style:family="text">'
    +'<style:text-properties fo:color="#800000" fo:language="zxx" fo:country="none" style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color" style:language-asian="zxx" style:country-asian="none" style:language-complex="zxx" style:country-complex="none"/>'
    +'</style:style>'
    +'<style:style style:name="ListLabel_20_1" style:display-name="ListLabel 1" style:family="text">'
    +'<style:text-properties style:font-name-complex="Symbol1" style:font-family-complex="Symbol" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="ListLabel_20_2" style:display-name="ListLabel 2" style:family="text">'
    +'<style:text-properties style:font-name-complex="OpenSymbol3" style:font-family-complex="OpenSymbol" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="ListLabel_20_3" style:display-name="ListLabel 3" style:family="text">'
    +'<style:text-properties style:font-name-complex="Symbol1" style:font-family-complex="Symbol" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="ListLabel_20_4" style:display-name="ListLabel 4" style:family="text">'
    +'<style:text-properties style:font-name-complex="OpenSymbol3" style:font-family-complex="OpenSymbol" style:font-family-generic-complex="system" style:font-pitch-complex="variable"/>'
    +'</style:style>'
    +'<style:style style:name="Frame" style:family="graphic">'
    +'<style:graphic-properties text:anchor-type="paragraph" svg:x="0cm" svg:y="0cm" fo:margin-left="0.201cm" fo:margin-right="0.201cm" fo:margin-top="0.201cm" fo:margin-bottom="0.201cm" style:wrap="parallel" style:number-wrapped-paragraphs="no-limit" style:wrap-contour="false" style:vertical-pos="top" style:vertical-rel="paragraph-content" style:horizontal-pos="center" style:horizontal-rel="paragraph-content" fo:padding="0.15cm" fo:border="0.06pt solid #000000"/>'
    +'</style:style>'
    +'<style:style style:name="OLE" style:family="graphic">'
    +'<style:graphic-properties text:anchor-type="paragraph" svg:x="0cm" svg:y="0cm" style:wrap="dynamic" style:number-wrapped-paragraphs="no-limit" style:wrap-contour="false" style:vertical-pos="top" style:vertical-rel="paragraph" style:horizontal-pos="center" style:horizontal-rel="paragraph"/>'
    +'</style:style>'
    +'<style:style style:name="Graphics" style:family="graphic">'
    +'<style:graphic-properties text:anchor-type="paragraph" svg:x="0cm" svg:y="0cm" style:wrap="dynamic" style:number-wrapped-paragraphs="no-limit" style:wrap-contour="false" style:vertical-pos="top" style:vertical-rel="paragraph" style:horizontal-pos="center" style:horizontal-rel="paragraph"/>'
    +'</style:style>'
    +'<text:outline-style style:name="Outline">'
    +'<text:outline-level-style text:level="1" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="0.762cm" fo:text-indent="-0.762cm" fo:margin-left="0.762cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="2" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.016cm" fo:text-indent="-1.016cm" fo:margin-left="1.016cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="3" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-1.27cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="4" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.524cm" fo:text-indent="-1.524cm" fo:margin-left="1.524cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="5" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.778cm" fo:text-indent="-1.778cm" fo:margin-left="1.778cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="6" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.032cm" fo:text-indent="-2.032cm" fo:margin-left="2.032cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="7" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.286cm" fo:text-indent="-2.286cm" fo:margin-left="2.286cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="8" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-2.54cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="9" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.794cm" fo:text-indent="-2.794cm" fo:margin-left="2.794cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'<text:outline-level-style text:level="10" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.048cm" fo:text-indent="-3.048cm" fo:margin-left="3.048cm"/>'
    +'</style:list-level-properties>'
    +'</text:outline-level-style>'
    +'</text:outline-style>'
    +'<text:list-style style:name="WW8Num1">'
    +'<text:list-level-style-number text:level="1" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="2" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.905cm" fo:text-indent="-0.635cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="3" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-0.635cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="4" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.175cm" fo:text-indent="-0.635cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="5" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.81cm" fo:text-indent="-0.635cm" fo:margin-left="3.81cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="6" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="4.445cm" fo:text-indent="-0.635cm" fo:margin-left="4.445cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="7" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.08cm" fo:text-indent="-0.635cm" fo:margin-left="5.08cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="8" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.715cm" fo:text-indent="-0.635cm" fo:margin-left="5.715cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="9" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.35cm" fo:text-indent="-0.635cm" fo:margin-left="6.35cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="10" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:list-style style:name="WW8Num2">'
    +'<text:list-level-style-number text:level="1" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="2" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.905cm" fo:text-indent="-0.635cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="3" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-0.635cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="4" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.175cm" fo:text-indent="-0.635cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="5" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.81cm" fo:text-indent="-0.635cm" fo:margin-left="3.81cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="6" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="4.445cm" fo:text-indent="-0.635cm" fo:margin-left="4.445cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="7" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.08cm" fo:text-indent="-0.635cm" fo:margin-left="5.08cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="8" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.715cm" fo:text-indent="-0.635cm" fo:margin-left="5.715cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="9" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.35cm" fo:text-indent="-0.635cm" fo:margin-left="6.35cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="10" style:num-suffix="." style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:list-style style:name="WWNum1">'
    +'<text:list-level-style-number text:level="1" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-0.762cm" fo:margin-left="1.397cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="2" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.016cm" fo:margin-left="1.651cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="3" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.27cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="4" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.524cm" fo:margin-left="2.159cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="5" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.778cm" fo:margin-left="2.413cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="6" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.032cm" fo:margin-left="2.667cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="7" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.286cm" fo:margin-left="2.921cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="8" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.54cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="9" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.794cm" fo:margin-left="3.429cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="10" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:list-style style:name="WWNum2">'
    +'<text:list-level-style-bullet text:level="1" text:style-name="ListLabel_20_3" style:num-suffix="" text:bullet-char="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.27cm" fo:text-indent="-0.635cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="Symbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="2" text:style-name="ListLabel_20_4" style:num-suffix="◦" text:bullet-char="◦">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="1.905cm" fo:text-indent="-0.635cm" fo:margin-left="1.905cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="3" text:style-name="ListLabel_20_4" style:num-suffix="▪" text:bullet-char="▪">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="2.54cm" fo:text-indent="-0.635cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="4" text:style-name="ListLabel_20_3" style:num-suffix="" text:bullet-char="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.175cm" fo:text-indent="-0.635cm" fo:margin-left="3.175cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="Symbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="5" text:style-name="ListLabel_20_4" style:num-suffix="◦" text:bullet-char="◦">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="3.81cm" fo:text-indent="-0.635cm" fo:margin-left="3.81cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="6" text:style-name="ListLabel_20_4" style:num-suffix="▪" text:bullet-char="▪">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="4.445cm" fo:text-indent="-0.635cm" fo:margin-left="4.445cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="7" text:style-name="ListLabel_20_3" style:num-suffix="" text:bullet-char="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.08cm" fo:text-indent="-0.635cm" fo:margin-left="5.08cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="Symbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="8" text:style-name="ListLabel_20_4" style:num-suffix="◦" text:bullet-char="◦">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="5.715cm" fo:text-indent="-0.635cm" fo:margin-left="5.715cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-bullet text:level="9" text:style-name="ListLabel_20_4" style:num-suffix="▪" text:bullet-char="▪">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.35cm" fo:text-indent="-0.635cm" fo:margin-left="6.35cm"/>'
    +'</style:list-level-properties>'
    +'<style:text-properties fo:font-family="OpenSymbol" style:font-style-name="Regular" style:font-pitch="variable" style:font-charset="x-symbol"/>'
    +'</text:list-level-style-bullet>'
    +'<text:list-level-style-number text:level="10" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:list-style style:name="WWNum3">'
    +'<text:list-level-style-number text:level="1" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-0.762cm" fo:margin-left="0.762cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="2" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.016cm" fo:margin-left="1.016cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="3" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.27cm" fo:margin-left="1.27cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="4" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.524cm" fo:margin-left="1.524cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="5" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-1.778cm" fo:margin-left="1.778cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="6" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.032cm" fo:margin-left="2.032cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="7" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.286cm" fo:margin-left="2.286cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="8" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.54cm" fo:margin-left="2.54cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="9" style:num-format="">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="nothing" fo:text-indent="-2.794cm" fo:margin-left="2.794cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'<text:list-level-style-number text:level="10" style:num-suffix="." style:num-format="1">'
    +'<style:list-level-properties text:list-level-position-and-space-mode="label-alignment">'
    +'<style:list-level-label-alignment text:label-followed-by="listtab" text:list-tab-stop-position="6.985cm" fo:text-indent="-0.635cm" fo:margin-left="6.985cm"/>'
    +'</style:list-level-properties>'
    +'</text:list-level-style-number>'
    +'</text:list-style>'
    +'<text:notes-configuration text:note-class="footnote" style:num-format="1" text:start-value="0" text:footnotes-position="page" text:start-numbering-at="document"/>'
    +'<text:notes-configuration text:note-class="endnote" style:num-format="i" text:start-value="0"/>'
    +'<text:linenumbering-configuration text:number-lines="false" text:offset="0.499cm" style:num-format="1" text:number-position="left" text:increment="5"/>'
    +'<style:default-page-layout>'
    +'<style:page-layout-properties style:writing-mode="lr-tb" style:layout-grid-standard-mode="true"/>'
    +'</style:default-page-layout>'
    +'</office:styles>';

