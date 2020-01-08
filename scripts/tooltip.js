
createEndtimeCommingTooltip = function (options, id) {
    var x;
    var y;
    var endtimeComming = new jBox('Tooltip', {
        // attach: elements, //elements,
        position: {
            'x': x,
            'y': y
        },
        id: 'endtimeComming' + id,
        width: 189,
        height: 200,
        pointer: 'center:-20',
        delayClose: 11111111110,
        fade: 0,

        content: ' <div style="font-size: 14px;line-height: 1.3;"><b style="font-size: 14px;">Achtung:</b> Der Abrufzeitraum endet morgen.<br /> Bitte schließen Sie die Generierung nun mit einem Download der Ausschnitte<br />ab, da diese sonst verfallen.' +
    '<div style="margin-top:20px;margin-bottom:5px;"><button class="cancel" style="width:86px;margin-right:10px;">Abbrechen</button><button class="ok" style="width:86px;font-weight:bolder;" >OK</button></div> ' +
    '<div><input type="checkbox" style="width:17px;height:17px;" name="anzeigen" value="false"><span style="vertical-align: top;font-size: 12px;padding-left: 4px;">Nicht mehr anzeigen</span></div>' +
                '</div>',
        onCreated: function () {
            $('#' + this.id + ' .jBox-content').css({ 'padding-top': '8px', 'padding-left': '8px' });
            $('#' + this.id + ' .jBox-pointer').css({
                'left': '197px',
                'top': '174px',
                'width': '0px',
                'height': '0px',
                '-webkit-transform': 'rotate(45deg)',
                '-moz-transform': 'rotate(45deg)',
                '-o-transform': 'rotate(45deg)',
                '-ms-transform': 'rotate(45deg)',
                'transform': 'rotate(45deg)',
                'border-left': '53px solid #B5222F',
                'border-top': '22px solid transparent',
                'border-bottom': '23px solid transparent'
            });
            $('#' + this.id + ' .jBox-container').css({ 'border-radius': '0px', 'background-color': '#FFF', 'z-index': 10000, 'border': '4px solid #B5222F', 'width': '197px', 'height': '187px' });
            $('#' + this.id + ' .jBox-pointer').parent().append('<div class="jBox-pointer jBox-pointer-bottom" style="left: 199px;' +
        ' margin-left: -20px; -webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-o-transform: rotate(45deg);-ms-transform: rotate(45deg);transform: rotate(45deg); height: 0px; top: 177px; z-index: 200000;width: 0px;' +
        ' border-left-width: 44px; border-left-style: solid; border-left-color: #FFF; border-top-width: 17px;' +
        ' border-top-style: solid; border-top-color: transparent; border-bottom-width: 18px; border-bottom-style: solid;' +
        ' border-bottom-color: transparent;"></div>');
        },
        onOpen: function () {
            if ($(this.source).parents('.obj').find('tr.objectTitleFullSlotsComplete').length > 0) {
                return false;
            }
            if(getCookie('showTooltips') === 'false'){
                return false;
            }
            var container = $(this.source).parent().parent().parent().parent().prev().find('.tooltipContainer');
            y = container.offset().top + 5;
            x = container.offset().left + 5;
            this.position({ 'x': x, 'y': y });
            return true;
        }

    });
    $(endtimeComming).on('opened', function (event, buttonsource) {
        $('#' + endtimeComming.id + ' .ok').on('click', function () {
            if ($('#' + endtimeComming.id + ' input[type=checkbox]').is(':checked')) {
                var setCookie = function(cname, cvalue, exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    var expires = "expires="+d.toUTCString();
                    document.cookie = cname + "=" + cvalue + "; " + expires;
                }
                setCookie('showTooltips',false,1000);
            }
            endtimeComming.close({ ignoreDelay: true });
            return false;
        });
        $('#' + endtimeComming.id + ' .cancel').on('click', function () {


            endtimeComming.close({ ignoreDelay: true });

        });
    });
    endtimeComming.open(options);
    toolTipsArr.push(endtimeComming);
}
var content = ' <div style="font-size: 14px;line-height: 1.2;position:absolute;z-index:1000000;width:190px;">' +
'<b style="font-size: 14px;">Hinweis:</b> Mit Abruf dieses Ausschnittes können in diesem Bundle keine Angebote des $holder$-Pakets mehr generiert werden.' +
'<div style="margin-top:20px;margin-bottom:5px;">' +
'<button class="cancel" style="width:86px;margin-right:10px;font-weight:bold;">Abbrechen</button>' +
'<button  class="ok"  style="width:86px;" >OK</button></div> ' +
'<div>' +
    '<input type="checkbox" style="width:17px;height:17px;" name="anzeigen" value="false"><span style="vertical-align: top;font-size: 12px;padding-left: 4px;">Nicht mehr anzeigen</span></div>' +
'</div>';

var contentRSProvider = ' <div style="font-size: 14px;line-height: 1.2;position:absolute;z-index:1000000;width:190px;">' +
'<b style="font-size: 14px;">Hinweis:</b> Mit Abruf dieses Ausschnittes stehen Ihnen für dieses Bundle noch maximal $value$ Ausschnitte des $holder$-Pakets sowie bis zu zwei Ausschnitte anderer Anbieter zur Verfügung.' +
'<div style="margin-top:3px;margin-bottom:5px;">' +
'<button class="cancel" style="width:86px;margin-right:10px;font-weight:bold;">Abbrechen</button>' +
'<button class="ok" style="width:86px;" >OK</button></div> ' +
'<div>' +
    '<input type="checkbox"  style="width:17px;height:17px;" name="anzeigen" value="false"><span style="vertical-align: top;font-size: 12px;padding-left: 4px;">Nicht mehr anzeigen</span></div>' +
'</div>';
var contentOneSlot = ' <div style="font-size: 14px; line-height: 1.2;position:absolute;z-index:1000000;width:190px;">' +
'<b style="font-size: 14px;">Hinweis:</b> Mit Download dieses Ausschnittes legen Sie die Adresse für dieses Bundle unwiderruflich fest.' +
'<div style="margin-top:25px;margin-bottom:5px;">' +
'<button class="cancel" style="width:86px;margin-right:10px;font-weight:bold;">Abbrechen</button>' +
'<button class="ok" style="width:86px;" >OK</button></div> ' +
'<div>' +
    '<input type="checkbox"  style="width:17px;height:17px;" name="anzeigen" value="false"><span style="vertical-align: top;font-size: 12px;padding-left: 4px;">Nicht mehr anzeigen</span></div>' +
'</div>';

var contentOnGeo = ' <div style="font-size: 14px; line-height: 1.2;position:absolute;z-index:1000000;width:200px;">' +
    '<b style="font-size: 14px;">Hinweis:</b> Ihre Wertin wird mit Klick auf "OK" erstellt und steht dann in wenigen Minuten zum Download zur Verfügung.' +
    '<div style="margin-top:45px;margin-bottom:5px;">' +
    '<button class="cancel" style="width:86px;margin-right:10px;font-weight:bold;">Abbrechen</button>' +
    '<button class="ok" style="width:86px;" >OK</button></div> ' +
    '<div>' +
        '<input type="checkbox"  style="width:17px;height:17px;" name="anzeigen" value="false"><span style="vertical-align: top;font-size: 12px;padding-left: 4px;">Nicht mehr anzeigen</span></div>' +
    '</div>';

var contentWebmapsBundle = '<div">'+
'<b style="font-size: 14px;">Hinweis: </b>Für den Abruf<br />dieses Ausschnittes müssen<br />Sie Webmaps-Bundles<br />zubuchen.'+
'<button class="cancel" style="width:86px;position:absolute;bottom:35px;left:5px;">Abbrechen</button>' +
'<button class="ok" style="width:86px;font-weight:bold;position:absolute;bottom:35px;right:25px;" >Zubuchen</button></div> ' +
'</div>';
createTooltip = function (id, selector, content, options) {
    var x;
    var y;
    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    var tooltip = new jBox('Tooltip', {
        id: id,
        position: {
            'x': x,
            'y': y
        },
        attach: selector, //$('input[type=button]'),
        delayClose: 111110,
        width: 189,
        height: 174,
        fade: 0,
        onCreated: function () {
            var container = $(this.source).parents('table').find('.tooltipContainer');
            var source = $(tooltip.source);
            source.parents('table.mapList').find('.tooltip-visible').removeClass('tooltip-visible');
            this.position({ 'x': x, 'y': y });
            var topPointer = $(this.source).offset().top - y;
            $('#' + this.id + ' .jBox-content').css({ 'padding-top': '8px', 'padding-left': '7px', 'width': '183px' });
            $('#' + this.id + ' .jBox-container').css({ 'border-radius': '0px', 'background-color': '#FFF', 'border': '4px solid #B5222F', 'width': '197px', 'height': '190px' });
            $('#' + this.id + ' .jBox-pointer').css({ 'height': '16px', 'z-index': '10000', 'right': '13px', 'top': topPointer + 'px', 'left': 'auto', 'overflow': 'visible' });

        },
        onOpen: function () {
            var source = $(tooltip.source);
            source.parents('table.mapList').find('.tooltip-visible').removeClass('tooltip-visible');
            if ($(this.source).parents('table.mapList tr').attr('data-isdownloaded') !== 'False') {
                this.detach(this.source);
                this.close({ ignoreDelay: true });
                return false;
            }
            var container = $(this.source).parents('table').find('.tooltipContainer');
            var provider = $(this.source).parents('tr').find('.mapservice-cell').html();
            var parentMap = $(this.source).parents('table.mapList');
            var rsProviderFullName = ['LDBV Bayern', 'Niedersachsen', 'Brandenburg', 'Sachsen', 'Sachsen-Anhalt', 'Rheinland-Pfalz', 'Baden-Württemberg'];
            var hasDownloadedRSProvider = false;
            parentMap.find('[data-isdownloaded=True] .mapservice-cell').each(function(i,v){ 
                if(~$.inArray($(v).html(), rsProviderFullName)){
                    hasDownloadedRSProvider = true;
                }					
            });
            if(getCookie('showTooltips') !== 'false'){
                        
                var isBayernAvailable = parentMap.find('tr[data-isbayernavailable=True]').length > 0;
                var isNiedesachsenAvailable = parentMap.find('tr[data-isniedersachsenavailable=True]').length > 0;
                var isBrandenburgAvailable = parentMap.find('tr[data-isbrandenburgavailable=True]').length > 0;
                var isSachsenAvailable = parentMap.find('tr[data-issachsenavailable=True]').length > 0;
                var isSachsenAnhaltAvailable = parentMap.find('tr[data-issachsenanhaltavailable=True]').length > 0;
                var isSchleswigHolsteinAvailable = false;//parentMap.find('tr[data-isschleswigholsteinavailable=True]').length > 0;
                var isRheinlandPfalzAvailable = parentMap.find('tr[data-isrheinlandpfalzavailable=True]').length > 0;
                var isBadenAvailable = false;//parentMap.find('tr[data-isbadenavailable=True]').length > 0;
                var isThueringenAvailable = false; //parentMap.find('tr[data-isthueringenavailable=True]').length > 0;
                var isBremenAvailable = false; //parentMap.find('tr[data-isbremenavailable=True]').length > 0;
                var providerName = '';
                switch (true) {
                    case isBayernAvailable:
                        {
                            providerName = 'Bayern';
                        }
                        break;
                    case isNiedesachsenAvailable:
                        {
                            providerName = 'Niedersachsen';
                        }
                        break;
                    case isBrandenburgAvailable:
                        {
                            providerName = 'Brandenburg';
                        }
                        break;
                    case isSachsenAvailable:
                        {
                            providerName = 'Sachsen';
                        }
                        break;
                    case isSchleswigHolsteinAvailable:
                        {
                            providerName = 'Schleswig-Holstein';
                        }
                        break;
                    case isSachsenAnhaltAvailable:
                        {
                            providerName = 'Sachsen-Anhalt';
                        }
                        break;
                    case isRheinlandPfalzAvailable:
                        {
                            providerName = 'Rheinland-Pfalz';
                        }
                        break;
                    case isBadenAvailable:
                        {
                            providerName = 'Baden-Württemberg';
                        }
                        break;
                    case isRheinlandPfalzAvailable:
                        {
                            providerName = 'Rheinland-Pfalz';
                        }
                        break;
                    case isThueringenAvailable:
                        {
                            providerName = 'Thüringen';
                        }
                        break;
                    case isBremenAvailable:
                        {
                            providerName = 'Bremen';
                        }
                        break;
                    default:
                        break;

                }
                if (
                     !~$.inArray(provider, rsProviderFullName)
                     && (isBremenAvailable || isThueringenAvailable || isBadenAvailable || isRheinlandPfalzAvailable || isSachsenAnhaltAvailable || isSchleswigHolsteinAvailable || isBayernAvailable || isNiedesachsenAvailable || isBrandenburgAvailable || isSachsenAvailable)
                     && parentMap.find('tr[data-isdownloaded]').length > 5 - reservedMapSlotsByMapSource[providerName]
                     && parentMap.find('tr[data-isdownloaded=True]').length === 5 - reservedMapSlotsByMapSource[providerName]
                     ){
                    var contentRS = content.replace(/\$holder\$/g, providerName);
                    $(this)[0].setContent(contentRS);
                } else if (~$.inArray(provider, rsProviderFullName) && !hasDownloadedRSProvider){
                    var contentRS = contentRSProvider.replace(/\$holder\$/g, providerName);
                    contentRS  = contentRS.replace(/\$value\$/g, reservedMapSlotsByMapSource.getAdditionalMapsAsText(providerName));
                    $(this)[0].setContent(contentRS);
                } else if ($(this.source).parents('.mapList[maps=1]').length === 1 && this.id.indexOf('firsttime') > -1 && provider !== 'GeoContent') {
                    $(this)[0].setContent(contentOneSlot);
                } else if ($(this.source).parents('.mapList[maps=1]').length === 1 && this.id.indexOf('firsttime') > -1 && provider === 'GeoContent') {
                    $(this)[0].setContent(contentOnGeo);
                } else if ($(this.source).parents('.obj').hasClass('flatrate-bundle') && $(this.source).parents('table.mapList tr').attr('data-isflatrateconfiguration') === 'false' && isMapLimitReachedObjectList) {
                    $(this)[0].setContent(contentWebmapsBundle);
                } else {
                    return false;
                }
            }else{
                return false;
            }
            parentMap.find('.tooltip-invisible').addClass('tooltip-visible');
            y = container.offset().top + 5;
            x = container.offset().left + 5;
            this.position({ 'x': x, 'y': y });
            var topPointer = $(this.source).offset().top - y;
            if (topPointer > $('#' + this.id + ' .jBox-container').height() - 22) {
                topPointer = $('#' + this.id + ' .jBox-container').height() - 22;
            }
            $('#' + this.id + ' .jBox-pointer').css({ 'top': topPointer + 'px' });
            return true;
        }


    });
    $(tooltip).on('opened', function (event, buttonsource) {
        $('#' + tooltip.id + ' .ok').on('click', function () {
            console.log(tooltip.id);
            var source = $(tooltip.source);
            if ($('#' + tooltip.id + ' input[type=checkbox]').is(':checked')) {
                var setCookie = function(cname, cvalue, exdays) {
                    var d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    var expires = "expires="+d.toUTCString();
                    document.cookie = cname + "=" + cvalue + "; " + expires;
                }
                setCookie('showTooltips',false,1000);
                tooltip.close({ ignoreDelay: true });
                source.parents('table.mapList').find('.tooltip-visible').removeClass('tooltip-visible');
                return false;
            }
            tooltip.close({ ignoreDelay: true });
             
        });
        $('#' + tooltip.id + ' .cancel').on('click', function () {
            var source = $(tooltip.source);
            tooltip.close({ ignoreDelay: true });
             
        });
    });
    if (options) {
        tooltip.open(options);
        tooltip.source = options.source[0];
    }
    toolTipsArr.push(tooltip);
}
createTooltip('regular', $('.getMapButton'), content);
var endtimeCommingTargets = $('.objectTitleUncompleteSlots').parents('table').next().find('.getAllMaps[value=klein]');
for (var index = 0, length = endtimeCommingTargets.length; index < length; index++) {
createEndtimeCommingTooltip({ source: $(endtimeCommingTargets[index]), ignoreDelay: true }, $(endtimeCommingTargets[index]).attr('data-number'));
}

var oneSlotTargets = $('.mapList[maps=1]').find('tr[data-isdownloaded=False] .getMapButton[value=klein]');
for (var index = 0, length = oneSlotTargets.length; index < length; index++) {
    createTooltip('firsttime_' + $(oneSlotTargets[index]).parents('tr').attr('data-objectid'), $(oneSlotTargets[index]), '', { source: $(oneSlotTargets[index]), ignoreDelay: true });
}

var onGeoTargets = $('.mapList[maps=1]').find('tr[data-isdownloaded=False] .getMapButton[value=Formular]');
for (var index = 0, length = onGeoTargets.length; index < length; index++) {

var provider = $(onGeoTargets[index]).parents('tr').find('.mapservice-cell').html();
console.log(provider);
if (provider == 'GeoContent') {
     createTooltip('firsttime_' + $(onGeoTargets[index]).parents('tr').attr('data-objectid'), $(onGeoTargets[index]), '', { source: $(onGeoTargets[index]), ignoreDelay: true });

                     $('.mapList[maps=1]').find('tr[data-isdownloaded=False] .getMapButton[value=Formular]').on('click', function () {

                          
                         $(this).find('Tooltip').removeClass('tooltip-visible');

    })
}
 
}
