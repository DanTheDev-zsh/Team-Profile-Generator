const inquirer = require('inquirer');
const fs = require('fs')
const generateHtml = require('./util/generateHtml.js');
// const Employee = require('./lib/Employee.js')
const Intern = require('./lib/Intern.js');
const Manager = require('./lib/Manager.js');
const Engineer = require('./lib/Engineer.js');

const indexHtml = "./dist/index.html";
const managerQuestions = ['Please enter the team manager\'s name: ', 'Please enter the team manager\'s employee ID: ', 'Please enter the team manager\'s email address: ', 'Please enter the team manager\'s office number: '];
const addEngineerQuestions = ['Please enter the name of the engineer: ', 'Please enter the ID of the engineer: ', 'Please enter the Email Address of the engineer: ', 'Please enter the Github Username of the engineer: '];
const addInternQuestions = ['Please enter the name of the Intern: ', 'Please enter the ID of the Intern: ', 'Please enter the Email Address of the Intern: ', 'Please enter the School of the Intern: ']

function writeToFile(fileName, data) {
    console.log({ fileName, data });
    try {
        fs.writeFile(fileName, data, (err) => {
            if (err) throw err;
            console.log("index.html successfully written");
        });
    }
    catch (err) {
        console.error(err);
    }
}

function init() {
    let responses = {};
    responses['engineers'] = [];
    responses['interns'] = [];
    const teamManagerOpts = [
        'Add an Engineer',
        'Add an Intern',
        'Finish building my Team'
    ];

    /**
     * @param {*} selected is the returned value from selectOption()
     */
    const managerOpt_Handler = async (selected) => {
        if (selected === teamManagerOpts[0]) {
            // recursive case: 
            console.log("I'm about to create a new Engineer");
            inquirer.prompt([
                {
                    type: 'input',
                    message: addEngineerQuestions[0],
                    name: 'engineer_Name',
                },
                {
                    type: 'input',
                    message: addEngineerQuestions[1],
                    name: 'engineer_ID',
                },
                {
                    type: 'input',
                    message: addEngineerQuestions[2],
                    name: 'engineer_Email',
                },
                {
                    type: 'input',
                    message: addEngineerQuestions[3],
                    name: 'engineer_GHusername',
                }
            ])
                .then(async (response) => {

                    responses['engineers'].push(
                        new Engineer(response.engineer_Name,
                            response.engineer_ID,
                            response.engineer_Email,
                            response.engineer_GHusername)
                    );
                    try {
                        const tmp = await selectOption(managerOpt_Handler);
                        managerOpt_Handler(tmp.teamManager_Option);
                    } catch (error) {
                        if (error.isTtyError) {
                            console.error('Error: Prompt cannot be rendered in the current environment (at selectOption block)');
                        } else {
                            console.error('Error: Something went wrong, not because of rendering at the current environment (at selectOption block)', { error });
                        }
                    }
                })
                .catch((error) => {
                    if (error.isTtyError) {
                        console.error('Error: Prompt cannot be rendered in the current environment (at add Engineer question block)');
                    } else {
                        console.error('Error: Something went wrong, not because of rendering at the current environment (at add Engineer question block) || ', { error });
                    }
                });

            // const opt = selectOption()
            // managerOpt_Handler(opt)

        } else if (selected === teamManagerOpts[1]) {
            // recursive case: Intern
            console.log("I'm about to create a new Intern");
            inquirer.prompt([
                {
                    type: 'input',
                    message: addInternQuestions[0],
                    name: 'intern_Name',
                },
                {
                    type: 'input',
                    message: addInternQuestions[1],
                    name: 'intern_ID',
                },
                {
                    type: 'input',
                    message: addInternQuestions[2],
                    name: 'intern_Email',
                },
                {
                    type: 'input',
                    message: addInternQuestions[3],
                    name: 'intern_School',
                }
            ])
                .then(async (response) => {

                    responses['interns'].push(
                        new Intern(response.intern_Name,
                            response.intern_ID,
                            response.intern_Email,
                            response.intern_School)
                    );
                    try {
                        const tmp = await selectOption(managerOpt_Handler);
                        managerOpt_Handler(tmp.teamManager_Option);
                    } catch (error) {
                        if (error.isTtyError) {
                            console.error('Error: Prompt cannot be rendered in the current environment (at selectOption block)');
                        } else {
                            console.error('Error: Something went wrong, not because of rendering at the current environment (at selectOption block)', { error });
                        }
                    }

                })
                .catch((error) => {
                    if (error.isTtyError) {
                        console.error('Error: Prompt cannot be rendered in the current environment (at add Intern question block)');
                    } else {
                        console.error('Error: Something went wrong, not because of rendering at the current environment (at add Intern question block)', error);
                    }
                });

        } else if (selected === teamManagerOpts[2]) {
            // base case
            console.log("I'm about to writeFile index.html and exit program");
            writeToFile(indexHtml, generateHtml(responses))
            return;
        } else {
            console.error("error selected is " + selected, ": exiting program");
            return;
        }
    }

    async function selectOption(handler) {
        return await inquirer.prompt({
            type: 'list',
            message: 'Please select from one of three options below.',
            choices: teamManagerOpts,
            name: 'teamManager_Option'
        })
    }

    inquirer
        .prompt([
            {
                type: 'input',
                message: managerQuestions[0],
                name: 'teamManager_Name',
            },
            {
                type: 'input',
                message: managerQuestions[1],
                name: 'teamManager_ID',
            },
            {
                type: 'input',
                message: managerQuestions[2],
                name: 'teamManager_Email',
            },
            {
                type: 'input',
                message: managerQuestions[3],
                name: 'teamManager_Office',
            },
            {
                type: 'list',
                message: 'Please select from one of three options below.',
                choices: teamManagerOpts,
                name: 'teamManager_Option'
            }
        ])
        .then((response) => {
            responses['teamManager_Obj'] =
                new Manager(response.teamManager_Name,
                    response.teamManager_ID,
                    response.teamManager_Email,
                    response.teamManager_Office);
            // calls recursive function
            console.log("finished creating Manager object, handing off to managerOption handler");
            managerOpt_Handler(response.teamManager_Option);
            return;
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.error('Error: Prompt cannot be rendered in the current environment (at manager question block)');
            } else {
                console.error({ status: 'Error: Something went wrong, not because of rendering at the current environment (at manager question block)', error });
            }
        });

}

// Function call to initialize app
init();