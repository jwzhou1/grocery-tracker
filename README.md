#   APP Name: Grocery Price Tracker

### Introducing Grocery Price Tracker: your ultimate companion for grocery shopping. Track historical prices to uncover true bargains, and receive notifications when prices drop. Plan your trips efficiently with our customizable shopping list feature. Can't find an item? Simply snap a picture and contribute its price. Effortlessly navigate through various categories and stay updated with hot deals from nearby supermarkets. With detailed product insights and an intuitive interface, making informed decisions has never been easier. Plus, your feedback ensures accurate pricing for all. Revolutionize your grocery shopping experience – download Grocery Price Tracker now!

###    Authors: Liyao Zhang, Jiawei Zhou

##    Iteration1: Overall Stucture, Navigation, and Basis of CRUD Operations to Firestore
###    Data Modal and Collections:
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
 
-   "altName": ,
-   "brand": "",
-   "category": "",
-   "image_url": ,
-   "name": ,
-   "prices": "",
-   "user": "",
-   "quantity": "",
-   "unit": "",


####  3. Prices Collection (Contribution: Liyao Zhang):
This is a top-level collection. Each document in the Prices collection represents a single price entry. It has these fields:

-   "date": ,
-   "price": "",
-   "product_id": "",
-   "restrictions": "",
-   "store_name": "",

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
**(still under implementation)**  

<img src="images/screen_images/home-screen.jpg" alt="Alt text" width="200">

On the home screen, the top of the screen displays the user's current location, requiring the user to grant permission for our app to access their current location. Following this, users can find a search bar that they can click to navigate to the search screen. Additionally, users will be able to view all grocery categories (still under implementation) and the hot deal banner (also still under implementation). At the bottom, there is a bottom tab for Home, Shopping List, and Profile.

**Search Screen (Contribution: Liyao Zhang):**
**(still under implementation)**  

<img src="images/screen_images/search-screen1.jpg" alt="Alt text" width="200"> <img src="images/screen_images/search-screen2.jpg" alt="Alt text" width="200">

On the search screen...

**Profile Screen (Contribution: Jiawei Zhou):**  

<img src="images/screen_images/profile-screen1.jpg" alt="Alt text" width="200">

The Profile Screen presents the user's profile information. Upon initial registration and login, if no profile image is uploaded, a default profile image is utilized. Below the profile image, there is a place to display the user's email address. Moreover, users have the option to click on "Edit Profile" on the Profile Screen to modify their profile, which includes updating their profile image. Additionally, users can access "My Watch List" (still under implementation) and "My Contributions" (also still under implementation) by tapping on the respective options. In the top right corner of the profile screen, there's an icon to logout and return to the signup screen.

**Edit Profile Screen (Contribution: Jiawei Zhou):**  

<img src="images/screen_images/edit-profile1.jpg" alt="Alt text" width="200">

The Edit Profile Screen presents the current user's email information at the top. Below, there is a section where users can upload their username (still under implementation). Additionally, users have the option to upload their profile image by either taking a photo using their device's camera or uploading from their device's local photo library.

<img src="images/screen_images/edit-profile2.jpg" alt="Alt text" width="200"> <img src="images/screen_images/edit-profile3.jpg" alt="Alt text" width="200">

After uploading a photo, the user's uploaded image will be displayed on the screen. Similarly, after taking a photo, the image captured by the user's camera will also be displayed. After users click on "Save" to update their profile picture, and they will be redirected back to the Profile Screen.

<img src="images/screen_images/profile-screen2.jpg" alt="Alt text" width="200"> <img src="images/screen_images/profile-screen3.jpg" alt="Alt text" width="200">

After saving the changes, users can view the updated profile picture on the Profile Screen.

<img src="images/screen_images/profile-screen4.jpg" alt="Alt text" width="200">

After clicking on the trash bin icon located at the bottom right corner of the profile picture, users can delete their current profile picture. Subsequently, the profile picture will revert to the default profile image. Additionally, the trash bin icon will disappear since the user no longer has an uploaded profile image associated with their account.