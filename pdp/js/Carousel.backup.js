function Carousel(ul, pages) {

    // Private vars
    var _i = 0;

    // Attribute declaration
    var $lis = $(ul + ' > li'),
        $ul = $(ul),
        $pages = $(pages),
        DragHelper = {
            Dragging: false,
            StartX: 0
        },
        CURRENT = 0,
        CURRENT_DEVICE = 'small',
        me = this;

    pages.innerHTML = '';

    // Create the proper number of pages
    for ( ; _i < $lis.length ; ++_i ) {

        var li = document.createElement('li');

        if (_i === CURRENT) {
            li.setAttribute('class', 'active');
        }

        $pages.append(li);
    }

    this.switchCurrent = function(newCurrent) {
        var _i = 0,
            _oldCurrent = 0;

        _oldCurrent = CURRENT;
        CURRENT = (newCurrent > $lis.length || newCurrent < 0) ? 0 : newCurrent;

        for ( ; _i < $lis.length ; ++_i ) {

            var _c = $($pages.find('li').get(_i)),
                _p = (_c.index() - CURRENT) * 66;

            $($lis.get(_i)).transition({ x: _p + '%' });

            if (_i === CURRENT) {
                $($lis.get(_i)).addClass('active');
                _c.attr('class', 'active');
            } else {
                $($lis.get(_i)).removeClass('active');
                _c.attr('class', '');
            }
        }
    }

    this.refreshImages = function(currScreenSize) {
        if (currScreenSize === 'small') {
            $lis.each(function() {
                var cssRules = JSON.parse($(this).find('div.picture').attr('data-mobile-style')),
                    relativePath = $(this).find('div.picture').attr('data-path'),
                    color = $(this).parent().parent().find('ul.color-picker li.active').attr('data-color'),
                    src = $(this).find('div.picture').attr('data-mobile-img');

                $(this).find('div.picture').css('background-image', 'url(' + (relativePath + color + '/' + src) + ')');
            });
        } else {
            $lis.each(function() {
                var cssRules = JSON.parse($(this).find('div.picture').attr('data-desktop-style')),
                    relativePath = $(this).find('div.picture').attr('data-path'),
                    color = $(this).parent().parent().find('ul.color-picker li.active').attr('data-color'),
                    src = $(this).find('div.picture').attr('data-desktop-img');

                for (var k in cssRules) {
                    $(this).find('div.picture').css(k, cssRules[k]);
                }

                $(this).find('div.picture').css('background-image', 'url(' + (relativePath + color + '/' + src) + ')');
            });
        }
    }

    this.handleDragStart = function(e) {
        if (window.getDeviceSize() === 'small') {
            var x = (Pointer.MOVE === 'touchmove') ? e.originalEvent.touches[0].clientX : e.clientX;

            DragHelper.StartX = x;
            DragHelper.Dragging = true;
        }
    }

    this.handleDragMove = function(e) {
        if ((window.getDeviceSize() === 'small') && DragHelper.Dragging) {
            var x = (Pointer.MOVE === 'touchmove') ? e.originalEvent.touches[0].clientX : e.clientX,
                width = $($lis.get(CURRENT)).width(),
                el = $($lis.get(CURRENT));

            if (e.currentTarget.nodeName === 'LI') {

                x = ((x - DragHelper.StartX) * 100) / width;

                $lis.each(function(i) {
                    // console.log(i - CURRENT);
                    var val = x + ((i - CURRENT) * 66);

                    $(this).transition({ x: val + '%' }, 0);
                });

                if (x < -50) {
                    if (CURRENT < $lis.length - 1) {
                        DragHelper.Dragging = false;
                        me.switchCurrent(CURRENT + 1);
                    }
                } else if (x > 50) {
                    if (CURRENT > 0) {
                        me.switchCurrent(CURRENT - 1);
                        DragHelper.Dragging = false;
                    }
                }
            }
        }
    }

    this.handleDragEnd = function(e) {
        if (window.getDeviceSize() === 'small') {
            var el = $($lis.get(CURRENT));

            DragHelper.Dragging = false;

            $lis.each(function(i) {
                var val = (i - CURRENT) * 66;

                $(this).transition({ x: val + '%' }, 100);
            });
        }
    }

    // Attach the event listeners
    $lis.bind(Pointer.DOWN, this.handleDragStart);
    $lis.bind(Pointer.MOVE, this.handleDragMove);
    $lis.bind(Pointer.UP, this.handleDragEnd);

    this.refreshImages(window.getDeviceSize());

    $ul.parent().find('ul.color-picker li').bind('click', function() {
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');

        me.refreshImages(CURRENT_DEVICE);
    });

    $(window).resize(function() {
        if (window.getDeviceSize() !== CURRENT_DEVICE) {
            CURRENT_DEVICE = window.getDeviceSize();

            me.refreshImages(CURRENT_DEVICE);
        }
    });

    return this;

}