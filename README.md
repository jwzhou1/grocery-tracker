#  Grocery Price Tracker

Introducing Grocery Price Tracker: your ultimate companion for grocery shopping. Track historical prices to uncover true bargains, and receive notifications when prices drop. Plan your trips efficiently with our customizable shopping list feature. Can't find an item? Simply snap a picture and contribute its price. Effortlessly navigate through various categories and stay updated with hot deals from nearby supermarkets. With detailed product insights and an intuitive interface, making informed decisions has never been easier. Plus, your feedback ensures accurate pricing for all. Revolutionize your grocery shopping experience – download Grocery Price Tracker now!

###    Authors: Liyao Zhang, Jiawei Zhou
###    Firebase and Google Map API setup:
```
  apiKey: "AIzaSyAVMvcs51ldmoFJsJ6BS8J445NdPdG3gCc"
  authDomain: "grocery-tracker-40a3b.firebaseapp.com"
  projectId: "grocery-tracker-40a3b"
  storageBucket: "grocery-tracker-40a3b.appspot.com"
  messagingSenderId: "179121607754"
  appId: "1:179121607754:web:0b62158ca1cc7c32ac02b3"
  GOOGLE_MAPS_API_KEY: "AIzaSyBUvWpC05hBwN4qdeW7W6PDvk9lq71Rj9M"
```

###    Firebase Rules:
####   Firestore Database
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /products/{document=**} {
      allow read: if true;
    }
    match /prices/{document=**} {
      allow read: if true;
    }
    // Allow read and write access to user info only for the authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null;
      
      // Allow read and write access to the user's shopping_list
      match /shopping_list/{document=**} {
        allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      	allow create: if request.auth != null;
      }

      // Allow read and write access to the user's contribution_list
      match /contribution_list/{document=**} {
        allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      	allow create: if request.auth != null;
      }
    }
  }
}
```
####   Storage:
```
  match /{allPaths=**} {
      allow read;
      allow create, write, delete;
    }
```

###    Data Model and Collections:
####   1. Users Collection (Contribution: Jiawei Zhou):
This is a top-level collection. Each document in the Users collection represents a user of our application. It has these fields:

-   "uid": "user_unique_id",
-   "email": "user@example.com",
-   "imageUri": "User Profile Image",

#### CRUD operations for Users Collection:

1. **Create (Register):**
   Users can register by providing email and password. Upon registration, a new document representing the user will be created in the Users Collection of the database. This document will include all the provided information, allowing the user to be identified within the system.

2. **Read (Login):**
   Users can log in by providing their credentials (email and password). The system will authenticate the user against the stored credentials in the Users Collection. Upon successful authentication, the user will be granted access to their account and associated functionalities.

3. **Update (Upload User's Profile Image):**
   Users can update their profile by uploading a new profile image. They have the option to choose an image file from their device's local library or capture a new image using their device's camera for upload. If a user does not upload a profile image, the system will use a default image. The uploaded image, whether chosen from the local library or captured via camera, will be stored in the firebase storage. Subsequently, the user's document in the Users Collection will be updated with a new field, imageUri, storing the reference to the uploaded image.

4. **Delete (Delete User's Profile Image):**
   Users can delete their profile image by initiating this action through the profile screen, clicking on a trash bin icon located at the bottom right corner of the profile image. This action triggers a request to delete the current profile image stored in the Firebase storage associated with their account. The system will remove the 'imageUri' field from the user's document in the Users Collection.

####  2. Products Collection (Contribution: Liyao Zhang):
This is a top-level collection. Each document in the Products collection represents a single product entry. It has these fields:

-   "name"
-   "alt_name"
-   "category"
-   "brand"
-   "quantity"
-   "unit"
-   "image_url"
-   "prices"

#### CRUD operations for Products Collection:
1. **Create:**
   The Products are created beforehand using a separate Node.js script (utils/upload.js)

2. **Read:**
   Users can search products by their names. Then a query will be executed and return matched products.

####  3. Prices Sub-Collection (Contribution: Liyao Zhang):
This is a sub collection in Products Collection. Each document in the Prices sub-collection represents a single price entry. It has these fields:

-   "date"
-   "price"
-   "unit_price"
-   "store_name"
-   "restrictions"
-   "product_id"

#### CRUD operations for Prices Collection:
1. **Create:**
   The Prices are created beforehand using a separate Node.js script (utils/upload.js)

2. **Read:**
   For each searched product, another query will be executed based on the product_id. And all price history will be returned.

### Screens
#### Auth Stack Screens (Contribution: Jiawei Zhou):
 <img src="images/screen_images/signup-screen.jpg" alt="Signup" width="200"> <img src="images/screen_images/login-screen.jpg" alt="Login" width="200">

The Auth Stack comprises two primary screens: the Sign Up Screen and the Log In Screen. Upon launching the app for the first time, users encounter the Sign Up Screen, presenting options for signing up or logging in. Both screens feature intuitive navigation buttons facilitating seamless transition between them.

<div style="display: flex; justify-content: space-around;">
    <img src="images/screen_images/invalid-email.PNG" alt="Invalid Email" height="150" style="margin-right: 10px;">
    <img src="images/screen_images/weak-password.PNG" alt="Weak Password" height="150" style="margin-right: 10px;">
    <img src="images/screen_images/mismatch-password.PNG" alt="Mismatch Password" height="150;">
</div>

The Log In Screen and Sign Up Screen are integrated with Firebase's Admin Authentication API Errors to handle common authentication issues. These screens are designed to display alerts for main errors such as invalid email format, weak password, password mismatch, and other relevant authentication errors as per Firebase's API guidelines.

#### App Stack Screens 
**Home Screen (Contribution: Jiawei Zhou):**

<img src="images/screen_images/home-screen.jpg" alt="Alt text" width="200">

On the home screen, the top displays the user's current location, requiring permission for our app to access it. Below this, users can find a search bar to navigate to the search screen. Additionally, users can view all grocery categories, each accompanied by a unique category image. Below the category cards is the hot deal banner, which requires manual updates by our team. At the bottom, there are tabs for Home, Shopping List, and Profile.

**Search Screen (Contribution: Liyao Zhang):**

<img src="images/screen_images/search-screen1.jpg" alt="Alt text" width="200"> <img src="images/screen_images/searchresult.png" alt="Alt text" width="200">

User can search products by their names(exact full name). However, due to limitations of Firebase, there is no support for full-text search yet. If user wants to have a better search experience, we may need to incorporate third-party search services like Typesense to achieve that. There are currently around 100 products ready for search. Please refer to the second workbook of utils/sample_data.xlsx for a comprehensive list of products. 

Also, users can view all results for a specific category by tapping a category icon at home page.

<img src="images/screen_images/search-category.png" alt="Alt text" width="200">

**Product Detail Screen (Contribution: Liyao Zhang):**

<img src="images/screen_images/productdetail1.jpg" alt="Alt text" width="200"> 

After tapping on the product preview card, you will navigate to a product detail screen where more information will be displayed, such as unit prices, stores, price range, price historical trend in the same store, and the option to add the product to your shopping list. There is also a 'Provide Feedback' button to help the app manager verify the price if you do not agree with the price shown. Additionally, you can navigate to the shopping list by clicking the shopping list icon in the top right corner of the screen.

<img src="images/screen_images/productdetail2.jpg" alt="Alt text" width="200"> 

On the product detail screen, you can click 'More Buying Options' to view different purchasing choices. Since Frozen Beef Short Ribs do not have additional buying options in our database, the 'More Buying Options' feature is disabled here. We use Ginger as an example to demonstrate the 'More Buying Options' functionality.

<img src="images/screen_images/productdetail3.jpg" alt="Alt text" width="200"> <img src="images/screen_images/productdetail4.jpg" alt="Alt text" width="200"> 

You can also click the 'Add to List' button, which will add the product to the logged-in user's shopping list. If it is added successfully, a popup will appear.

**Feedback Screen (Contribution: Liyao Zhang, Jiawei Zhou):**
####     Camera use
<img src="images/screen_images/feedback1.jpg" alt="Alt text" width="200">

If users do not agree with the price, they can click the 'Provide Feedback' button on the product screen to navigate to the Feedback screen and contribute a new price record for that product. 

<img src="images/screen_images/feedback2.jpg" alt="Alt text" width="200">   

Users can only submit a new price they found at the same store. Users should upload an image from their local library or take a picture to provide proof of the new price.

<img src="images/screen_images/feedback3.jpg" alt="Alt text" width="200"> <img src="images/screen_images/feedback4.jpg" alt="Alt text" width="200">

Users also need to specify the new price and the date when they found it. When a user clicks the submit button, the price will be uploaded to the contribution screen.

**My Contributions Screen (Contribution: Liyao Zhang, Jiawei Zhou):**

<img src="images/screen_images/contribution1.jpg" alt="Alt text" width="200">

Users can access their contributions on the profile screen. After clicking in, they will see their contributions. Here, users can view their contributed price, contribution date, the image they took or uploaded, and the store name. Users can also see the status of their contribution, which is currently pending. If the app manager approves this contribution, the status will change. However, the approval process is not implemented yet.


**Shopping List Screen (Contribution: Liyao Zhang):**

<img src="images/screen_images/shoppinglist1.jpg" alt="Alt text" width="200"> <img src="images/screen_images/shoppinglist2.jpg" alt="Alt text" width="200"> 

Now, let's go to the shopping list screen to review the list. The shopping list is organized by store name. On this screen, you can increase the quantity by pressing the '+' button or decrease it by pressing the '-' button. You can also remove a product from your shopping list by tapping the 'trash' icon. In the top right corner, you can see the total price for each product. When you click the '+' or '-' symbol to adjust the quantity, the total price will change accordingly.

**Profile Screen (Contribution: Jiawei Zhou):**  

<img src="images/screen_images/profile-screen1.jpg" alt="Alt text" width="200">

The Profile Screen presents the user's profile information. Upon initial registration and login, if no profile image is uploaded, a default profile image is utilized. Below the profile image, there is a place to display the user's email address. Moreover, users have the option to click on "Edit Profile" on the Profile Screen to modify their profile, which includes updating their profile image. Additionally, users can access "My Watch List" (still under implementation) and "My Contributions" (also still under implementation) by tapping on the respective options. Users can also access 'Schedule a Notification' to schedule a notification for shopping. In the top right corner of the profile screen, there's an icon to logout and return to the signup screen.

**Edit Profile Screen (Contribution: Jiawei Zhou):**  

<img src="images/screen_images/edit-profile1.jpg" alt="Alt text" width="200">

The Edit Profile Screen presents the current user's email information at the top. Below, users have the option to upload their profile image by either taking a photo using their device's camera or uploading from their device's local photo library.

<img src="images/screen_images/edit-profile2.jpg" alt="Alt text" width="200"> <img src="images/screen_images/edit-profile3.jpg" alt="Alt text" width="200">

After uploading a photo, the user's uploaded image will be displayed on the screen. Similarly, after taking a photo, the image captured by the user's camera will also be displayed. After users click on "Save" to update their profile picture, and they will be redirected back to the Profile Screen.

<img src="images/screen_images/profile-screen2.jpg" alt="Alt text" width="200"> 

After saving the changes, users can view the updated profile picture on the Profile Screen.

<img src="images/screen_images/profile-screen4.jpg" alt="Alt text" width="200">

After clicking on the trash bin icon located at the bottom right corner of the profile picture, users can delete their current profile picture. Subsequently, the profile picture will revert to the default profile image. Additionally, the trash bin icon will disappear since the user no longer has an uploaded profile image associated with their account.

**Map Screen (Contribution: Jiawei Zhou):**

### Location Use and External API Use

<img src="images/screen_images/map1.png" alt="Alt text" width="200"> <img src="images/screen_images/map2.jpg" alt="Alt text" width="200">

To access the map screen, you need to go to the main page and click on the map icon in the top right corner. This action will direct you to the map screen. On this screen, you will notice two colors of markers: the blue marker indicates the user's current location, while the red marker represents nearby supermarkets. On this screen, the app will automatically display the nearby supermarket locations with red markers if you authorize the app to access your location. We utilize the Google API to search for these supermarkets.

<img src="images/screen_images/map3.jpg" alt="Alt text" width="200"> <img src="images/screen_images/map4.jpg" alt="Alt text" width="200">

When you click the red marker, it will display information about the supermarket's name and location at the bottom. Additionally, the supermarket name will appear above the red marker. You can also notice a button labeled "Navigate" in the bottom supermarket information window. If you click this button, it will direct you to the Google Maps app on your phone and assist you in navigating to the selected supermarket location.

<img src="images/screen_images/map5.jpg" alt="Alt text" width="200">

Here we use the Google Location API as the external API:

```
 const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=supermarket&key=${GOOGLE_MAPS_API_KEY}`
      );
```

**Notification Screen (Contribution: Jiawei Zhou):** 

<img src="images/screen_images/notification1.jpg" alt="Alt text" width="200"> <img src="images/screen_images/notification2.jpg" alt="Alt text" width="200">

Users can set shopping notifications in the notification screen. By clicking the "Set Shopping Notifications" button, a date-time picker will appear. Users can then choose the time they want to receive notifications to go shopping.

<img src="images/screen_images/notification3.jpg" alt="Alt text" width="200"> <img src="images/screen_images/notification4.jpg" alt="Alt text" width="200">

After selecting the desired time, it will be displayed on the notification screen. Then, at the selected time, a notification will appear on the phone.