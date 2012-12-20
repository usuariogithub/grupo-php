/**
 * Copyright 2009 binaryd
 * Licensed under the MIT License
 * http://binaryd.com/about/free-license/
 * 
 * Author: Stephen Daugherty
 * Date: 6/30/2009
 */
/**
 * This code has been provided as is for educational purposes. It is highly
 * recommended that this code be minified before being placed into a
 * production environment.
 * 
 * The gallery is generated based on the content of a local xml file 
 * in this instance named images.xml and stored locally with the html.
 * You can replace this ajax request to any other ajax request of your 
 * own creation howver the xml schmea returned should be consistent to the
 * following:
 * 
 * <?xml version="1.0" encoding="utf-8"?>
 * <images>
 *    <image thumb="thumbnail.jpg" mid="medium.jpg" full="fullsize.jpg" text="Description Text" />
 *    ...
 * </images>
 * 
 * Each <image /> node represents a single gallery item with 
 * thumb, mid, and full being the file names to the thumbnail, medium quality
 * and full resolution images for that item.  
 */
//management object to keep track of all the images
var image = function()
{
   this.thumbnail = null;
   this.midsize = null;
   this.fullsize = null;
   this.text = null;
}

//all currently loaded images
var allImages = [];

//index of the currently loaded image
var current = 0;

//path to where the images for the gallery reside
var path = "images/gallery/";

//references to the frequently used dom elements
var galleryThumbs;
var galleryCount;
var imageContainer;

//flag that sets the first thumbnail loaded to active
var firstThumb = true;

$(document).ready(function()
{
   galleryThumbs = $("#gallery-thumbs");
   galleryThumbs.html("");
   galleryCount = $("#gallery-count");
   imageContainer = $("#image-container");
   
   //get the image information and generate the
   $.get("images.xml", function(xml)
   {
      var toBeAdded = [];
      $(xml).find("image").each(function(i)
      {
         var newImage = new image();
         newImage.thumbnail = $(this).attr("thumb");
         newImage.midsize = $(this).attr("mid");
         newImage.fullsize = $(this).attr("full");
         newImage.text = $(this).attr("text");
         
         allImages.push(newImage);
         
         var newItem = $("<li title=\"" + (i + 1) + "\"><img src=\"" + (path + newImage.thumbnail) + "\" alt=\"" + (i + 1) + "\" /></li>")
         newItem.hide();
         toBeAdded.push(newItem);
      });
      
      addThumbnail(toBeAdded);
   });
});

//recursively add the thumbnails to create that staggared effect
function addThumbnail(thumbs)
{
	//when all the thumbnails are loaded setup the gallery operations
   if (thumbs.length < 1) 
   {
      setInitialStage();
      return;
   }
   
   var thisThumb = thumbs[0];
   galleryThumbs.append(thisThumb);
   
   if (firstThumb) 
   {
      firstThumb = false;
      thisThumb.addClass("active").fadeTo(1, 1);
   }
   
   thumbs = thumbs.slice(1);
   thisThumb.slideDown(250, function()
   {
      addThumbnail(thumbs);
   });
}

//setup the funtionaliy for the next, previous, and image thumbnails
function setInitialStage()
{
	//setup the animated hover on the thumbnails
   $("#side-showcase>ul>li").hover(function()
   {
      if ($(this).hasClass("active")) 
         return;
      
      $(this).stop(true);
      $(this).fadeTo("fast", 1);
   }, function()
   {
      if ($(this).hasClass("active")) 
         return;
      
      $(this).stop(true);
      $(this).fadeTo("fast", .6);
   });
   
	//load the initial image
   $("#quote>h2").fadeOut(400, function()
   {
      $(this).remove();
      
      var newText = $("<h2>" + allImages[0].text + "</h2>");
      newText.hide();
      $("#quote").append(newText);
      
      newText.fadeIn(400);
		
		var newContent = $("<a style=\"display:block;\" href=\"" + (path + allImages[0].fullsize) +
	   	"\" target=\"_blank\"><img src=\"" + (path + allImages[0].midsize) + "\" alt=\"Click to see larger image\" /></a>");
		newContent.fadeTo(1, 0); 
		imageContainer.html("");
	   imageContainer.append(newContent);
		
		$("#gallery-count").html("1/" + allImages.length);
      
      newContent.fadeTo(400, 1);
   });
   
	//assign the click functionality to the thumbnails
   $("#side-showcase>ul>li").click(function()
   {
      if ($(this).hasClass("active") || imageContainer.children("a").is(":animated")) 
         return;
      
      $("#side-showcase>ul>li.active").removeClass("active").fadeTo("fast", .6);
      
      $(this).addClass("active").fadeTo("fast", 1);
      
      var number = parseInt($(this).attr("title"));
      current = number - 1;
      
      loadNewImage();
   });
   
	//assign the previous functionality to the prev element
   $("#prev").click(function()
   {
      if (imageContainer.children("a").is(":animated")) 
         return;
      
      current--;
      if (current < 0) 
         current = allImages.length - 1;
      
      $("#side-showcase>ul>li.active").removeClass("active").fadeTo("fast", .7);
      $("#side-showcase>ul>li:eq(" + current + ")").addClass("active").fadeTo("fast", 1);
      
      loadNewImage();
   });
   
	//assign the next functionality to the next element
   $("#next").click(function()
   {
      if (imageContainer.children("a").is(":animated")) 
         return;
      
      current++;
      if (current == allImages.length) 
         current = 0;
      
      $("#side-showcase>ul>li.active").removeClass("active").fadeTo("fast", .7);
      $("#side-showcase>ul>li:eq(" + current + ")").addClass("active").fadeTo("fast", 1);
      
      loadNewImage();
   });
}

//load the new image into the container based on the current index
function loadNewImage()
{
   $("#gallery-count").html((current + 1) + "/" + allImages.length);
   $("#quote>h2").fadeOut(400, function()
   {
      $(this).remove();
      
      var newText = $("<h2>" + allImages[current].text + "</h2>");
      newText.hide();
      $("#quote").append(newText);
      
      newText.fadeIn(400);
   });
   
   imageContainer.children("a").fadeTo(400, 0, function()
   {
      var newContent = $("<a href=\"" + (path + allImages[current].fullsize) + "\" target=\"_blank\"><img src=\"" +
	      (path + allImages[current].midsize) + "\" alt=\"Click to see larger image\" /></a>");
      
      newContent.fadeTo(1, 0);
      imageContainer.append(newContent);
      $(this).remove();
      newContent.fadeTo(400, 1);
   });
}