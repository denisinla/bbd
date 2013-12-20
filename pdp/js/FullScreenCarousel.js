function FullScreenCarousel($lis, color) {

    // Private vars
    var _i = 0;

    // Attribute declaration
    var CURRENT = 0,
        $g = $('<div class="gallery">'
             +    '<a href="#fullscreen" class="fullscreen"></a>'
             +    '<ul class="gallery"></ul>'
             +    '<ul class="pages"></ul>'
             + '</div>'),
        $ul = $g.find('ul.gallery'),
        $pages = $g.find('ul.pages'),
        spacing = 55,
        offset = 0,
        me = this;

    this.switchCurrent = function(newCurrent) {
        var _i = 0,
            _oldCurrent = 0;

        _oldCurrent = CURRENT;
        CURRENT = (newCurrent > $ul.find('li').length || newCurrent < 0) ? 0 : newCurrent;

        for ( ; _i < $lis.length ; ++_i ) {

            var _c = $($pages.find('li').get(_i)),
                _p = ((_c.index() - CURRENT) * spacing);

            if (_i === CURRENT) {
                _p += offset;

                $($ul.find('li').get(_i)).transition({ opacity: 1, x: _p + '%' });
            } else if (_i < CURRENT) {
                var _o = 0.8;

                _p += offset * 3;

                $($ul.find('li').get(_i)).transition({ opacity: _o, x: _p + '%' });
            } else {
                _p += offset * 0;

                $($ul.find('li').get(_i)).transition({ opacity: 0.8, x: _p + '%' });
            }

            $($ul.find('li').get(_i)).transition({ x: _p + '%' });

            if (_i === CURRENT) {
                $($ul.find('li').get(_i)).addClass('active');
                _c.attr('class', 'active');
            } else {
                $($ul.find('li').get(_i)).removeClass('active');
                _c.attr('class', '');
            }
        }
    }

    this.requestFullScreen = function(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    this.fullScreenStatus = function() {
        return document.fullscreen ||
               document.mozFullScreen ||
               document.webkitIsFullScreen ||
               false;
    }

    this.cancelFullScreen = function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    this.render = function(color) {

        $lis.each(function(i) {
            var path = $(this).find('div.picture').attr('data-path'),
                relImg = $(this).find('div.picture').attr('data-desktop-img'),
                li = document.createElement('li');

            if (i === CURRENT) {
                li.setAttribute('class', 'active');
            }

            $pages.append(li);

            $ul.append('<li style="background-image: url(' + (path + color + '/' + relImg) + ')">'
                      +     '<a href="#">'
                      +         '<span class="prev"></span>'
                      +         '<span class="next"></span>'
                      +     '</a>'
                      + '</li>');
        });

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
            } else { // Close
                $('body').css('overflow', 'auto');
                $g.remove();
            }
        });

        $('body').css('overflow', 'hidden');
        $('body').append($g);

        me.switchCurrent(0);

        // Go full screen
        me.requestFullScreen($g.get(0));

        $g.find('a.fullscreen').bind(Pointer.UP, function() {
            $(this).removeClass('open');
            me.cancelFullScreen();
            $('body').css('overflow', 'auto');
            $g.remove();
        });
    }

    $(window).bind('keydown', function(e) {
        if (e.keyCode === 39) { // Right
            if (CURRENT < $lis.length - 1) {
                me.switchCurrent(CURRENT + 1);
            }
        } else if (e.keyCode === 37) { // Left
            if (CURRENT > 0) {
                me.switchCurrent(CURRENT - 1);
            }
        } else if (e.keyCode === 27) { // Escape
            me.cancelFullScreen();
            $('body').css('overflow', 'auto');
            $g.remove();
        }
    });

    $(document).bind('webkitfullscreenchange', function(e) {
        if (!document.webkitIsFullScreen) {
            $('body').css('overflow', 'auto');
            $g.remove();
        }
    });

    $(document).bind('mozfullscreenchange', function(e) {
        if (!document.mozIsFullScreen) {
            $('body').css('overflow', 'auto');
            $g.remove();
        }
    });

    $(document).bind('fullscreenchange', function(e) {
        if (!document.isFullScreen) {
            $('body').css('overflow', 'auto');
            $g.remove();
        }
    });

    this.render(color);

}