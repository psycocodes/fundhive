// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Project {
        address owner;
        string title;
        string description;
        string image;
        uint256 target;
        uint256 raised;
        uint256 deadline;
        TeamMember[] team;
        address[] donators;
        uint256[] donations;
    }

    struct TeamMember {
        address member;
        string role;
    }

    mapping(uint256 => Project) public projects; // Defines the mapping object(like a list) of the Object Project to a unique ID and public means it can be accessed outside the contract
    uint256 public projectCount = 0; // Defines the number of projects created

    function createProject(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _image,
        TeamMember[] memory _team,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        Project storage project = projects[projectCount]; // type storage_type(memory(cleared after function execution(integers are in memory by default, strings arent as they are reference type data)) or storage(stays on the chain)) variable_name = something; Here we are defining a Project(not assigning) and storing it in the blockchain

        // Require(): This will take a condition and a statement and will only proceed further in the function when the code is executed;

        require(project.deadline < block.timestamp, "Deadline has passed");

        // Assign the values to the object with the function parameters

        project.owner = _owner;
        project.title = _title;
        project.description = _description;
        project.image = _image;
        for (uint i = 0; i < _team.length; i++) {
            project.team.push(
                TeamMember({member: _team[i].member, role: _team[i].role})
            );
        }
        project.target = _target;
        project.deadline = _deadline;

        projectCount++;

        return projectCount - 1; // Index of the this created Project
    }
    function donatetoProject(uint256 _projectId) public payable {
        // Payable means we would be transferring cryptocurrency through this account
        uint256 amount = msg.value;
        Project storage project = projects[_projectId];

        (bool sent, ) = payable(project.owner).call{value: amount}("");

        // if (sent) {
        //     project.raised += amount;
        // }

        require(sent, "Transaction Failed");

        project.raised += amount;
        project.donations.push(amount);
        project.donators.push(msg.sender);
    }
    function getDonaters(
        uint256 _projectId
    ) public view returns (address[] memory, uint256[] memory) {
        // Used for getting Data like a get function
        return (projects[_projectId].donators, projects[_projectId].donations);
    }
    function getProjects() public view returns (Project[] memory) {
        // You can't directly access a contract's state, thats you need to copy it
        Project[] memory _Projects = new Project[](projectCount);
        for (uint i = 0; i < projectCount; i++) {
            Project storage element = projects[i]; // We are doing storage because dynamic data like arrays cannot be fetched with memory vars and also to access its values we need to reference storage
            // Copy team members
            TeamMember[] memory _Team = new TeamMember[](element.team.length);
            for (uint j = 0; j < element.team.length; j++) {
                TeamMember memory item = element.team[j];
                _Team[j] = TeamMember({member: item.member, role: item.role});
            }

            _Projects[i] = Project({
                owner: element.owner,
                title: element.title,
                description: element.description,
                image: element.image,
                target: element.target,
                raised: element.raised,
                team: _Team,
                deadline: element.deadline,
                donators: element.donators,
                donations: element.donations
            });
        }
        return _Projects;
    }
}
