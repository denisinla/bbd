;(function() {

    'use strict';

    document.addEventListener('DOMContentLoaded', init, false);

    var B = {},
        DeviceSizes = {
            SMALL: 'small',
            MEDIUM: 'medium',
            LARGE: 'large'
        },
        deviceSize = DeviceSizes.SMALL,
        isMenuOpen = false,
        headerOptsLocation = DeviceSizes.SMALL;

    window.Pointer = {
        UP: (Modernizr.touch) ? 'touchend' : 'mouseup',
        DOWN: (Modernizr.touch) ? 'touchstart' : 'mousedown',
        MOVE: (Modernizr.touch) ? 'touchmove' : 'mousemove'
    };

    B.getClientWidth = function () {
        return (document.documentElement || document.body).clientWidth;
    };

    B.calculateSize = function(data) {
        var w = B.getClientWidth();

        if (w < 703) {
            deviceSize = DeviceSizes.SMALL;
        } else if (w >= 704 && w < 960) {
            deviceSize = DeviceSizes.MEDIUM;
        } else {
            deviceSize = DeviceSizes.LARGE;
        }

        return;
    }

    window.getDeviceSize = function() {
        return deviceSize;
    }

    B.openMenu = function() {
        var _p = ((-26.8 * $(window).width()) / 100);

        if (!isMenuOpen) {
            $('div.content').transition({ x: _p + '%' }, 300, 'ease-in-out');
            $('div.menu-opts-mobile').transition({ 'width': ($(window).width() + (_p * 0.52)) });

            $('div.content').css('overflow', 'hidden');
            $('div.content').scrollTop(0);

            isMenuOpen = true;
        } else {
            $('div.content').transition({ x: '0' }, 300, 'ease-in-out');
            $('div.menu-opts-mobile').transition({ 'width': '0' });

            $('div.content').css('overflow', 'auto');
            isMenuOpen = false;
        }
    }

    B.openMenuOption = function() {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
        } else {
            $(this).parent().find('li').removeClass('open');

            $(this).addClass('open');
        }
    }

    B.handleGlobalResize = function() {
        B.calculateSize();

        var hliopts = $('header ul li.menu-opts'),
            mopts = $('div.menu-opts-mobile');

        if (window.getDeviceSize() === DeviceSizes.SMALL) {
            if (headerOptsLocation !== DeviceSizes.SMALL) {
                mopts.html(hliopts.html());
                hliopts.html('');
                headerOptsLocation = DeviceSizes.SMALL;
            }
        } else {
            if (headerOptsLocation !== DeviceSizes.LARGE &&
                headerOptsLocation !== DeviceSizes.MEDIUM) {

                hliopts.html(mopts.html());
                mopts.html('');

                headerOptsLocation = window.getDeviceSize();


                $('div.menu-opts-mobile > ul > li').click(B.openMenuOption);
            }
        }

        $('header li.search a').bind(Pointer.DOWN, function() {
            $('header li.search').toggleClass('open');
        });
    }

    B.handleGlobalScroll = function(e) {
        if ($('section.m1').length > 0 &&
            window.getDeviceSize() === DeviceSizes.LARGE) {

            var $m1 = $('section.m1'),
                m1t = $m1.offset().top - $('header').height(),
                st = $(this).scrollTop();

            if (st > $('header').height() + $m1.height()) {
                $('nav ul').addClass('afterModule1');
            } else {
                $('nav ul').removeClass('afterModule1');
            }
        }

        if ($('section.m4').length > 0 &&
            window.getDeviceSize() === DeviceSizes.LARGE) {

            var $m4 = $('section.m4'),
                m4t = $m4.offset().top - $('header').height(),
                st = $(this).scrollTop(),
                threshold = 300;

            if (st > m4t  - threshold &&
                st < m4t + $m4.height()) {
                $m4.addClass('open');
            } else {
                $m4.removeClass('open');
            }
        }

        if ($('section.m5').length > 0 &&
            window.getDeviceSize() === DeviceSizes.LARGE) {

            var $m5 = $('section.m5'),
                m5t = $m5.offset().top - $('header').height(),
                st = $(this).scrollTop(),
                threshold = 100;

            if (st < m5t + threshold &&
                st > m5t - threshold) {
                $m5.find('video').get(0).play();
            }
        }
    }

    B.toggleFooterMenu = function(e) {
        $(this).parent().toggleClass('open');
    }

    B.toggleOpen = function(section) {
        section.find('span.icon').bind('click', function() {
            section.toggleClass('active');
        });
    }

    function init() {

        B.handleGlobalResize();

        $('header li.menu').bind(Pointer.DOWN, B.openMenu);
        $('div.menu-opts-mobile > ul > li').click(B.openMenuOption);

        $(window).resize(B.handleGlobalResize);
        $(document).bind('scroll', B.handleGlobalScroll);

        if (window.getDeviceSize() === DeviceSizes.LARGE ||
            window.getDeviceSize() === DeviceSizes.MEDIUM) {
            $('header ul li.menu-opts ul li a').bind(Pointer.UP, function() {

                if ($(this).parent().hasClass('open')) {
                    $(this).parent().removeClass('open');
                } else {
                    $(this).parent().parent().find('li').removeClass('open');
                    $(this).parent().addClass('open');
                }
            });
        }

        if ($('section.m1').length > 0) {

            $('section.m1 #open-details').bind(Pointer.DOWN, function() {
                if ($('section.m1 div.details-container').hasClass('open')) {
                    $('section.m1 div.details-container').removeClass('open');
                } else {
                    $('section.m1 div.details-container').addClass('open');
                }
            });

            // Module12 Carousel
            var c = new Carousel('section.m1 ul.gallery', 'section.m1 ul.pages');

        }

        if ($('section.m2').length > 0) {

            // Module 2 Carousel
            var c = new ScrollableCarousel('section.m2 ul.feature-list', 'section.m2 ul.pages');

            $('section.m2 a.read-more, section.m2 a.read-less').bind(Pointer.UP, function() {
                $('section.m2').toggleClass('open');
            });

        }

        if ($('section.m3').length > 0) {
            B.toggleOpen($('section.m3'));
        }

        if ($('section.m4').length > 0) {
            B.toggleOpen($('section.m4'));
        }

        if ($('section.m5').length > 0) {
            B.toggleOpen($('section.m5'));
        }

        if ($('section.m6').length > 0) {
            B.toggleOpen($('section.m6'));
        }

        $('footer ul.main li.contact-us h4, footer ul.main li.get-help h4').click(B.toggleFooterMenu);
    }
    // Final Countdown ...
    $(function(){
      $('.shop-timer').countdown({
        render: function(data){
          var el = $(this.el);
          el.empty()
            .append("<div>" + this.leadingZeros(data.hours, 2) + "</div><div class='dots'>:</div>")
            .append("<div>" + this.leadingZeros(data.min, 2) + "</div><div class='dots'>:</div>")
            .append("<div>" + this.leadingZeros(data.sec, 2) + "</div>");
        }
      });
      window.addEventListener("load",function(){
        setTimeout(function(){
          window.scrollTo(0,1);
        }, 0);
      });

    });


}());