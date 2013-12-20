function Carousel(ul, pages) {

    // Private vars
    var _i = 0;

    // Attribute declaration
    var $lis = $(ul + ' > li'),
        $ul = $(ul),
        $pages = $(pages),
        $cp = $ul.parent().find('div.color-picker ul'),
        $addToCart = $ul.parent().find('div.shop-share a.add-to-cart'),
        $share = $ul.parent().find('div.shop-share a.share'),

        DragHelper = {
            Dragging: false,
            StartX: 0
        },
        ColorPickerDragHelper = {
            Dragging: false,
            StartX: 0
        },
        CURRENT = 0,
        CURRENT_DEVICE = window.getDeviceSize(),
        me = this,
        spacing = (CURRENT_DEVICE === 'small') ? 66 : 55,
        offset = (CURRENT_DEVICE === 'small') ? 0 : 10;

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
                _p = ((_c.index() - CURRENT) * spacing);

            if (_i === CURRENT) {
                _p += offset;

                $($lis.get(_i)).transition({ opacity: 1, x: _p + '%' });
            } else if (_i < CURRENT) {
                var _o = (window.getDeviceSize() === 'small') ? 0.8 : 0.1;

                _p += offset * 3;

                $($lis.get(_i)).transition({ opacity: _o, x: _p + '%' });
            } else {
                _p += offset * 0;

                $($lis.get(_i)).transition({ opacity: 0.8, x: _p + '%' });
            }

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
                var $dp = $(this).find('div.picture');

                var cssRules = JSON.parse($dp.attr('data-mobile-style')),
                    relativePath = $dp.attr('data-path'),
                    color = $(this).parent().parent().find('div.color-picker ul li.active').attr('data-color'),
                    src = $dp.attr('data-mobile-img');

                for (var k in cssRules) {
                    $dp.css(k, cssRules[k]);
                }

                $dp.css('background-image', 'url(' + (relativePath + color + '/' + src) + ')');
            });
        } else {
            $lis.each(function() {
                var $dp = $(this).find('div.picture');

                var cssRules = JSON.parse($dp.attr('data-desktop-style')),
                    relativePath = $dp.attr('data-path'),
                    color = $(this).parent().parent().find('div.color-picker ul li.active').attr('data-color'),
                    src = $dp.attr('data-desktop-img');

                for (var k in cssRules) {
                    $dp.css(k, cssRules[k]);
                }

                $dp.css('background-image', 'url(' + (relativePath + color + '/' + src) + ')');
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

    $cp.find('li').bind('click', function() {
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');

        me.refreshImages(CURRENT_DEVICE);
    });

    // Switch to the first one and recalculate positions
    this.switchCurrent(0);

    // Set the width of the color picker ul
    if (CURRENT_DEVICE === 'small') {
        $cp.width($cp.find('li').length * $cp.find('li').width() + 41);
    }

    // Drag Controls for the color picker
    $cp.bind(Pointer.DOWN, function(e) {
        if (window.getDeviceSize() === 'small') {
            var x = (Pointer.MOVE === 'touchmove') ? e.originalEvent.touches[0].clientX : e.clientX;

            ColorPickerDragHelper.StartX = x + $cp.parent().scrollLeft();
            ColorPickerDragHelper.Dragging = true;
        }
    });

    $cp.bind(Pointer.MOVE, function(e) {
        if ((CURRENT_DEVICE === 'small') && ColorPickerDragHelper.Dragging) {
            var x = (Pointer.MOVE === 'touchmove') ? e.originalEvent.touches[0].clientX : e.clientX,
                val = ColorPickerDragHelper.StartX - x;

            $cp.parent().scrollLeft(val);
        }
    });

    $cp.bind(Pointer.UP, function(e) {
        ColorPickerDragHelper.Dragging = false;
    });

    if (window.getDeviceSize() === 'large') {
        $ul.find('li a').bind(Pointer.DOWN, function(e) {
            var $el = $(e.target);

            if ($el.hasClass('prev')) { // Previous
                if (CURRENT > 0) {
                    me.switchCurrent(CURRENT - 1);
                }
            } else if ($el.hasClass('next')) { // Next
                if (CURRENT < $lis.length - 1) {
                    me.switchCurrent(CURRENT + 1);
                }
            } else { // Zoom
                var currentColor = $ul.parent().find('div.color-picker ul li.active').attr('data-color'),
                    g = new FullScreenCarousel($lis, currentColor);
            }
        });

        $(window).bind('keydown', function(e) {
            if (e.keyCode === 39) { // Right
                if (CURRENT < $lis.length - 1) {
                    me.switchCurrent(CURRENT + 1);
                }
            } else if (e.keyCode === 37) { // Left
                if (CURRENT > 0) {
                    me.switchCurrent(CURRENT - 1);
                }
            }
        });
    }

    $addToCart.bind(Pointer.DOWN, function() {
        $('header div.shop').css('opacity', 1);

        $('div.content').scrollTop(0);

        setTimeout(function() {
            $('header div.shop').css('opacity', 0);
        }, 3000);
    });

    $share.bind(Pointer.DOWN, function() {
        if (window.getDeviceSize() === 'small') {
            $('#mobile-share-dialog').addClass('open');

            $('#mobile-share-dialog a.close').bind(Pointer.DOWN, function() {
                $('#mobile-share-dialog').removeClass('open');
            });
        }
    });

    $pages.find('li').bind('click', function() {
        me.switchCurrent($(this).index());
    });

    $(window).resize(function() {
        if (window.getDeviceSize() !== CURRENT_DEVICE) {
            CURRENT_DEVICE = window.getDeviceSize();

            me.refreshImages(CURRENT_DEVICE);

            // Set the width of the color picker ul
            if (window.getDeviceSize() === 'small') {
                $cp.width($cp.find('li').length * $cp.find('li').width() + 41);
            }
        }
    });

    return this;

}