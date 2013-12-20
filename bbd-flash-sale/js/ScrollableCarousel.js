function ScrollableCarousel(ul, pages) {

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
        CURRENT_DEVICE = window.getDeviceSize(),
        me = this,
        scrollPosition = 0,
        transitioning = false,
        s2offset = $('section.m2').offset().top - $('header').height();

    pages.innerHTML = '';

    // Create the proper number of pages
    for ( ; _i < $lis.length ; ++_i ) {

        var li = document.createElement('li');

        if (_i === CURRENT) {
            li.setAttribute('class', 'active');
        }

        $pages.append(li);
    }

    this.refreshImages = function(currScreenSize) {
        if (currScreenSize === 'small') {
            $lis.each(function() {
                var cssRules = JSON.parse($(this).find('div.picture').attr('data-mobile-style'));

                for (var k in cssRules) {
                    $(this).find('div.picture').css(k, cssRules[k]);
                }

                $(this).find('div.picture').css('background-image', 'url(' + $(this).find('div.picture').attr('data-mobile-img') + ')');
            });
        } else {
            $lis.each(function() {
                var cssRules = JSON.parse($(this).find('div.picture').attr('data-desktop-style'));

                for (var k in cssRules) {
                    $(this).find('div.picture').css(k, cssRules[k]);
                }

                $(this).find('div.picture').css('background-image', 'url(' + $(this).find('div.picture').attr('data-desktop-img') + ')');
            });
        }
    }

    this.switchCurrent = function(newCurrent) {
        var _i = 0,
            _oldCurrent = 0;

        _oldCurrent = CURRENT;
        CURRENT = (newCurrent > $lis.length || newCurrent < 0) ? 0 : newCurrent;

        transitioning = true;

        for ( ; _i < $lis.length ; ++_i ) {

            var _c = $($pages.find('li').get(_i)),
                _p = (_c.index() - CURRENT) * 100;

            if (window.getDeviceSize() === 'small') {
                $($lis.get(_i)).transition({ x: _p + '%', y: 0 });
            } else {
                $($lis.get(_i)).transition({ x: 0, y: _p + '%' }, 300);
            }

            if (_i === CURRENT) {
                $($lis.get(_i)).addClass('active');
                _c.attr('class', 'active');
            } else {
                $($lis.get(_i)).removeClass('active');
                _c.attr('class', '');
            }
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

                el.transition({ x: x + '%' }, 0);

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

            el.transition({ x: '0%' });
        }
    }

    this.handleScroll = function(e) {
        if (window.getDeviceSize() === 'large') {
            var $s2 = $('section.m2'),
                $pb = $('div.page-bottom'),
                st = $(document).scrollTop(),
                h = $s2.find('ul.feature-list > li').height(),
                l = $s2.find('ul.feature-list > li').length,
                mh = h * (l - 1.8);

            if (st > s2offset && st < (s2offset + (h * l))) {

                var percentage = ((st - s2offset) * 100) / $s2.find('ul.feature-list > li').height(),
                    curr = ((percentage / 100) >> 0) + 1,
                    top = ((curr * 100) - percentage);

                if (curr > $s2.find('ul.feature-list > li').length) {
                    curr = $s2.find('ul.feature-list > li').length;
                    top = ((curr * 100) - percentage);
                }

                if (top < 0) {
                    top = 0;
                }

                if (percentage > ((l - 1.6) * 100)) {
                    percentage = (l - 1.6) * 100;
                }

                // As soon as the module reaches the "top" of the window
                if (!$s2.hasClass('parallax')) {
                    $s2.addClass('parallax');
                    $s2.css('position', 'fixed');
                    $s2.css('top', $('header').height());

                    $pb.css('position', 'fixed');
                    $pb.css('top', $('header').height() + $('section.m2').height());
                }

                // In-between (not my brightest moment, I must warn you, I did this after an 18 hour workday, under quite a bit of pressure...)
                for (var i = 0; i < l; i++) {
                    var litop = (80 * i) - percentage,
                        imgmov = (i * 80) - percentage,
                        scale = 1,
                        opacity = 1,
                        yoffset = $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').attr('data-yaxis-offset') >> 0 || 0,
                        blur = 0;

                    imgmov *= 0.4;
                    opacity = (imgmov * 7) * 0.01;
                    blur = opacity * ((i === (l-1)) ? 5 : 15);
                    opacity = 1 - opacity;

                    scale *= 1.0 + (imgmov * 1) * 0.01;

                    if (!$s2.hasClass('parallax')) {
                        litop += 80;
                    }

                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +')').css('z-index', 10 + i);
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +')').css('top', litop + '%');

                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('top', (imgmov + yoffset) + '%');
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('-webkit-transform', 'scale(' + scale + ')');
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('-moz-transform', 'scale(' + scale + ')');
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('-ms-transform', 'scale(' + scale + ')');
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('transform', 'scale(' + scale + ')');
                    $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('opacity', opacity);

                    // $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('-webkit-filter', 'blur(' + blur + 'px)');
                    // $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('-moz-filter', 'blur(' + blur + 'px)');
                    // $s2.find('ul.feature-list > li:nth-child(' + (i + 1) +') div.picture').css('filter', 'blur(' + blur + 'px)');

                }

                // As soon as the bottom of the last module reaches the "top" of the window
                if (st > (s2offset + mh)) {
                    $s2.removeClass('parallax');
                    $s2.css('position', 'relative');
                    $s2.css('top', mh);

                    $pb.css('position', 'relative');
                    $pb.css('top', mh);
                }

            } else {

                // Outside the "scrollable" area
                if ($s2.hasClass('parallax')) {
                    $s2.removeClass('parallax');
                    $s2.css('position', 'static');
                    $s2.height('auto');
                    $s2.css('top', 'auto');
                    $pb.css('position', 'static');
                }

            }
        }
    }

    // Attach the event listeners
    $lis.bind(Pointer.DOWN, this.handleDragStart);
    $lis.bind(Pointer.MOVE, this.handleDragMove);
    $lis.bind(Pointer.UP, this.handleDragEnd);

    $(document).scroll(this.handleScroll);

    this.refreshImages(window.getDeviceSize());

    if (CURRENT_DEVICE === 'large') {
        // var h = $('body').height() + ($('section.m2').find('ul.feature-list > li').height() * $('section.m2').find('ul.feature-list > li').length);
        var h = $('body').height() + ($('section.m2').find('ul.feature-list > li').height());
        $('body').height(h);
    }

    $(window).resize(function() {
        if (window.getDeviceSize() !== CURRENT_DEVICE) {
            CURRENT_DEVICE = window.getDeviceSize();

            s2offset = $('section.m2').offset().top - $('header').height();

            if (CURRENT_DEVICE === 'large') {
                var h = $('body').height() + ($('section.m2').find('ul.feature-list > li').height() * $('section.m2').find('ul.feature-list > li').length);
                $('body').height(h);
            } else {
                $('body').height('auto');
            }

            me.refreshImages(CURRENT_DEVICE);
        }
    });

    return this;

}