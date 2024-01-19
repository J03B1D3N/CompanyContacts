COMPANY CONTACTS

This is an app I made during my front-end internship at Teltonika IoT Academy.

DESIGN:

This app is designed to be used as an internal company tool for managing a big directory of employees. When first landing on the home page, you see the list of all the employees that work under the mother company (in this case TELTONIKA). Above the employee display there are filters to help you with your search. In the filter you can choose the company, its' offices, its' offices divisions, its' divisions departments and its' departments groups. Above the filter you have a search bar which takes in one string parameter and narrows the employee display according to that parameter. The search bar can be used to search for: name, surname, email, position and phone number. It accepts incomplete values i.e: youre looking for "peter", but if you type in "eter" or "pete", peter will still show up.

there is a log in function. The super admin username: admin@teltonika.lt, password: adminadmin. 
when logged in as a super admin, you access the full functionality of the app which allows you to create, edit and delete all employees, all companies, all structure (offices, divisions, departments and groups), and other users. only the super admin has access to user manipulation.

as a super admin in the user (paskyros) tab, you can create, edit and delete users. When creating a user, you have to put in their name, email and which permissions you would like to grant them. Once the user is created, the email you have provided will receive an email asking them to set a new password for their account (if they fail to do so, the default password is asdasd). Once they log in to their account, they will be able to do all of the things the super admin has given them permission to do. The super admin can edit, create and delete users at any time. If they have edited permissions, they will take into effect the next time the user has logged in.

HOW TO RUN THE APP:

to run the app, just go to: https://j03b1d3n.github.io/CompanyContacts/

TECHNOLOGIES USED:

vuejs 2,
pocketbase,
vite,
gitlab,
github,
git,
vuelidate,
tailwind,
vue materials, 
vue router,
fly.io,
docker,
and vuex for state management.

WHAT WOULD I DO DIFFERENT:

next time i would be building such a big app I would compartmentalize more efficiently:
    1. instead of two separate forms for create and edit, i would just create one form for both, because they are so similar.
    2. the popUp component doesnt need to be as if another modal window, it can simply be used directly in the modal, which saves a little bit of code.

These are the two biggest mistakes i currently see in this app.

Feel free to test this app and if you find any bugs or mistakes message me on linkedIn (in my bio)

