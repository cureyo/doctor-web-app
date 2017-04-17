/*!

 =========================================================
 * Material Dashboard Angular - V1.1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-angular2
 * Copyright 2017 Creative Tim (https://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-angular/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */

 var $ = jQuery;
$(document).ready(function(){
    $moving_tab = $('<div class="moving-tab"/>');
    $('.sidebar .nav-container').append($moving_tab);

    $this = $('.sidebar .nav').find('li.active a');
    animationSidebar($this, false);
    $('div').removeClass('.moving-tab');
     $this.css({color: '#137a9c'});
    if (window.history && window.history.pushState) {

        // console.log('sunt in window.history');
        $(window).on('popstate', function() {
            console.log("popstate")
            // console.log('am apasat pe back, locatia noua: ', window.location.pathname);

            setTimeout(function(){
                // console.log('incep animatia cu 1ms delay');
                $this = $('.sidebar .nav').find('li.active a');
                animationSidebar($this,true);
            },1);

        });

    }
});

$('.sidebar .nav > li > a').click(function(){
    $this = $(this);
    animationSidebar($this, true);
});

function animationSidebar($this, animate){
    // console.log('incep animatia si butonul pe care sunt acum este:', $this[0].href );
    console.log($this);
    
    $('#dashboardButton').css({color: '#3C4858'});
    $('#profileButton').css({color: '#3C4858'});


    $('#planButton').css({color: '#3C4858'});
     $('#reportButton').css({color: '#3C4858'});
     $('#doctorJobMenu').css({color: '#3C4858'});
    if ($this.parent('li').position()) {
        $current_li_distance = $this.parent('li').position().top - 10;

    button_text = $this.html();
    console.log("$this");
    console.log($this);
    $(".moving-tab").css("width", 230 + "px");

    if(animate){
        $('.moving-tab').css({
            'transform':'translate3d(0,' + $current_li_distance + 'px, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });
    }else{
        $('.moving-tab').css({
            'transform':'translate3d(0,' + $current_li_distance + 'px, 0)'
        });
    }

    setTimeout(function(){
        $('.moving-tab').html(button_text);
       $this.css({color: 'white'});
       $this.css('.i', {color: 'white'});
       
       $this.parent('.i').css({color: 'white'});
         
    }, 100);
    }
    
}
