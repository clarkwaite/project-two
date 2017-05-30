$(function () {

  if ($('.formattedDrinkDate').length > 0) {
    for (let i = 0; i < $('.formattedDrinkDate').length; i++) {

        var $drinkDateElement = $('.formattedDrinkDate')[i];
        var drinkDate = new Date($drinkDateElement.textContent);
        var formattedDrinkDate = drinkDate.toISOString().slice(0, 10);
        
        $('.formattedDrinkDate').html(formattedDrinkDate);
    }
  }
});
