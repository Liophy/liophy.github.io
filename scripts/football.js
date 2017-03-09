function startApp() {
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_ByqWfGbBe";
    const kinveyAppSecret = "1d9bf49947f14c95a06f127fcb3e150b";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    $("#loadingBox").hide();
    $("#infoBox").hide();
    $("#errorBox").hide();

    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewAppHome');

    $("#linkMenuAppHome").click(showHomeView);
    $("#linkMenuLogin").click(showLoginView);
    $("#linkMenuRegister").click(showRegisterView);

    $("#linkMenuUserHome").click(showHomeViewUser);

    $("#linkMenuAllMatches").click(listAllMatches);
    $("#linkMenuAllPlayers").click(listAllPlayers);
    $("#linkMenuLogout").click(logoutUser);

    $("#formLogin").submit(loginUser);
    $("#formRegister").submit(registerUser);
    $("#formAddNewPlayer").submit(addNewPlayer);
    $("#formAddNewMatch").submit(addNewMatch);

    $("#linkUserHomeAddMatch").click(addNewMatchView);
    $("#linkUserHomeAddPlayer").click(addNewPlayerView);

    $("#linkUserHomeRecalculateMatches").click(reCalculateAllMatches);


    $("#infoBox, #errorBox").click(function () {
        $(this).fadeOut();
    });

    //$(document).on({
    //    ajaxStart: function () {
    //        $("#loadingBox").show()
    //    },
    //    ajaxStop: function () {
    //        $("#loadingBox").hide()
    //    }
    //});

    function showHideMenuLinks() {
        $("#linkMenuAppHome").show();
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $("#linkMenuAppHome").hide();
            $("#linkMenuLogin").hide();
            $("#linkMenuRegister").hide();
            $("#linkMenuUserHome").show();
            $("#linkMenuLogout").show();
        } else {
            // No logged in user
            $("#linkMenuAppHome").show();
            $("#linkMenuLogin").show();
            $("#linkMenuRegister").show();
            $("#linkMenuUserHome").hide();
            $("#linkMenuLogout").hide();
        }
    }

    $("form").submit(function (e) {
        e.preventDefault()
    });

    function showView(viewName) {
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showHomeView() {
        showView('viewAppHome');
    }

    function showHomeViewUser() {
        showView('viewUserHome');
    }

    function showLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset');
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    function getKinveyUserAuthHeaders() {
        return {
            "Authorization": "Kinvey " + sessionStorage.getItem("authToken")
        }
    }

    function loginUser() {
        let userData = {
            username: $("#loginUsername").val(),
            password: $("#loginPasswd").val(),

        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: loginSuccess,
            error: handleAjaxError
        });
        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showHomeViewUser();
            showInfo('Login successful.');
        }
    }

    function registerUser(event) {
        event.preventDefault();

        let userData = {
            username: $("#registerUsername").val(),
            password: $("#registerPasswd").val(),
            name: $("#registerName").val(),
            playerstats: {
                points: Number(0),
                rank: Number(1000)
            }
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showHomeViewUser();
            showInfo('User registration successful.');
        }
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem("username", userInfo.username);
        sessionStorage.setItem("name", userInfo.name);
        sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
        sessionStorage.setItem("userId", userInfo._id);
        $("#spanMenuLoggedInUser").text("Welcome, " + userInfo.name);
        $("#viewUserHomeHeading").text("Welcome, " + userInfo.name);
    }

    function logoutUser() {
        return $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/_logout",
            headers: getKinveyUserAuthHeaders(),
            success: successLogout(),
            error: handleAjaxError
        });

        function successLogout() {
            sessionStorage.clear();
            $("#spanMenuLoggedInUser").text('');
            showView('viewAppHome');
            showInfo("Logout Successful")
            showHideMenuLinks();
        }
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 1000);
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    function listAllMatches() {
        showView('viewAllMatches');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches",
            headers: getKinveyUserAuthHeaders(),
            success: loadMatchesSuccess,
            error: handleAjaxError
        });


        function loadMatchesSuccess(matches) {

            matches.sort(function (a, b) {
                return new Date(a.date) - new Date(b.date)
            });

            $('#listAllMatches').empty();
            //showInfo('Matches loaded.');

            if (matches.length == 0) {
                $('#listAllMatches').text('Няма мачове.');
            }

            else {
                let matchTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>N</th>' +
                        '<th>Отбор 1</th>' +
                        '<th></th>' +
                        '<th></th>' +
                        '<th>Отбор 2</th>' +
                        '<th>Дата</th>'
                    ));
                let count = 1;
                for (let match of matches) {
                    appendMatchRow(match, matchTable);
                }

                $('#listAllMatches').append(matchTable);

                function appendMatchRow(match, matchTable) {

                    let editMatchLink = $('<a href="#">[Edit]</a>').click(editMatch.bind(this, match));
                    let showMatchLink = $('<a href="#"></a>').click(showSingleMatch.bind(this, match));


                    matchTable.append($('<tr>').append(
                        $('<td>').text(count).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team1.name).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team1.result).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team2.result).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team2.name).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.date).click(showSingleMatch.bind(this, match)),
                        $('<td>')
                            //.append(editMatchLink)
                    ));
                    count++
                }
            }
        }


    }

    function listAllPlayers() {
        showView('viewAllPlayers');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: getKinveyUserAuthHeaders(),
            success: loadUsersSuccess,
            error: handleAjaxError
        });

        function loadUsersSuccess(players) {

            function compare(a, b) {
                if (Number(a.playerstats.rank) < Number(b.playerstats.rank))
                    return 1;
                if (Number(a.playerstats.rank) > Number(b.playerstats.rank))
                    return -1;
                return 0;
            }

            players.sort(compare);

            //showInfo('Players loaded');
            $('#viewAllPlayers').empty();

            let playersTable = $('<table>')
                .append($('<tr>').append(
                    '<th>N</th>' +
                    '<th>Име</th>' +
                    '<th>Ранг</th>' +
                    '<th>Точки</th>' +
                    '<th>Мачове</th>' +
                    '<th>Победи</th>' +
                    '<th>Равни</th>' +
                    '<th>Загуби</th>'
                ));
            $('#viewAllPlayers').append(playersTable);
            let count = 1;


            for (let player of players) {
                appendPlayerRow(player, playersTable);
                count++;
            }

            function appendPlayerRow(player, playersTable) {


                let editLink = $('<a href="#">[Edit]</a>').click(editPlayer.bind(this, player));

                playersTable.append($('<tr>').append(
                    $('<td>').text(count),
                    $('<td>').text(player.username).click(showSinglePlayer.bind(this, player)),
                    $('<td>').text(player.playerstats.rank),
                    $('<td>').text(player.playerstats.points),
                    $('<td>').text(player.playerstats.matches),
                    $('<td>').text(player.playerstats.wins),
                    $('<td>').text(player.playerstats.draws),
                    $('<td>').text(player.playerstats.losses),
                    $('<td>')
                        //.append(editLink)
                ));
            }
        }
    }

    function editPlayer(player) {
        //cartItem== player

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + `/${sessionStorage.getItem('userId')}`,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json',
            success: getUserItemsSuccess,
            error: handleAjaxError
        });

        function getUserItemsSuccess(object) {

            for (let item in object.cart) {

                if (cartItem == item) {
                    delete object.cart[cartItem]

                    $.ajax({
                        method: "PUT",
                        url: kinveyBaseUrl + "user/" + kinveyAppKey + `/${sessionStorage.getItem('userId')}`,
                        headers: getKinveyUserAuthHeaders(),
                        data: object,
                        success: updateCartSuccess,
                        error: handleAjaxError
                    });

                    function updateCartSuccess() {
                        showInfo("Item discarded");
                        showView('viewCart');
                    }
                }
            }

        }

    }

    function editMatch(match) {

    }

    function addNewMatchView() {

        $('#formAddNewMatch').trigger('reset');
        showView('viewAddMatch');
        loadPlayersInSelect();
        autocomplete();
        dateTimePicker();
    }

    function addNewMatch() {

        let match = {
            "date": $("#datetimepicker").val(),
            "video": $("#video").val(),
            "team1": {
                "name": $("#teamOneName").val(),
                "result": $("#teamOneResult").val(),
                "player1": {
                    "_id": $("#teamOnePlayerOne").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerOne").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerOne").find(":selected").data("value").playerstats
                },
                "player2": {
                    "_id": $("#teamOnePlayerTwo").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerTwo").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerTwo").find(":selected").data("value").playerstats
                },
                "player3": {
                    "_id": $("#teamOnePlayerThree").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerThree").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerThree").find(":selected").data("value").playerstats
                },
                "player4": {
                    "_id": $("#teamOnePlayerFour").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerFour").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerFour").find(":selected").data("value").playerstats
                },
                "player5": {
                    "_id": $("#teamOnePlayerFive").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerFive").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerFive").find(":selected").data("value").playerstats
                },
                "player6": {
                    "_id": $("#teamOnePlayerSix").find(":selected").data("value")._id,
                    "username": $("#teamOnePlayerSix").find(":selected").data("value").username,
                    "playerstats": $("#teamOnePlayerSix").find(":selected").data("value").playerstats
                }
            },
            "team2": {
                "name": $("#teamTwoName").val(),
                "result": $("#teamTwoResult").val(),
                "player1": {
                    "_id": $("#teamTwoPlayerOne").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerOne").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerOne").find(":selected").data("value").playerstats
                },
                "player2": {
                    "_id": $("#teamTwoPlayerTwo").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerTwo").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerTwo").find(":selected").data("value").playerstats
                },
                "player3": {
                    "_id": $("#teamTwoPlayerThree").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerThree").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerThree").find(":selected").data("value").playerstats
                },
                "player4": {
                    "_id": $("#teamTwoPlayerFour").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerFour").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerFour").find(":selected").data("value").playerstats
                },
                "player5": {
                    "_id": $("#teamTwoPlayerFive").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerFive").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerFive").find(":selected").data("value").playerstats
                },
                "player6": {
                    "_id": $("#teamTwoPlayerSix").find(":selected").data("value")._id,
                    "username": $("#teamTwoPlayerSix").find(":selected").data("value").username,
                    "playerstats": $("#teamTwoPlayerSix").find(":selected").data("value").playerstats
                }
            }
        };

        //$.ajax({
        //    method: "POST",
        //    url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches",
        //    headers: getKinveyUserAuthHeaders(),
        //    data: match,
        //    success: addMatchSuccess,
        //    error: handleAjaxError
        //});


        //function addMatchSuccess(match) {
        //}
        calculateMatch(match);
        showHomeViewUser();
        showInfo('Мачът е добавен успешно.');

    }

    function showSingleMatch(match) {
        $('#showSingleMatch').empty();
        showView('viewSingleMatch');


        let singleMatchTable = $('<table>')
            .append($('<tr>').append(
                $('<th>').text(match.team1.name),
                $('<th>').text(match.team1.result),
                $('<th>').text(match.team2.result),
                $('<th>').text(match.team2.name)
            )).append($('<tr>').append(
                $('<td>').text(""),
                $('<td>').text(match.team1.rank),
                $('<td>').text(match.team2.rank),
                $('<td>').text("Отборен ранг преди мача")
            )).append($('<tr>').append(
                $('<td>').text(""),
                $('<td>').text(Number(match.team1.coefficient).toFixed(2)),
                $('<td>').text(Number(match.team2.coefficient).toFixed(2)),
                $('<td>').text("Коефициент")
            ));

        let singleMatchPlayersTable = $('<table>')
            .append($('<tr>').append(
                $('<th>').text("Играч"),
                $('<th>').text("Точки"),
                $('<th>').text("Точки"),
                $('<th>').text("Играч")
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player1.username).click(showSinglePlayer.bind(this, match.team1.player1)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player1)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player1)),
                $('<td>').text(match.team2.player1.username).click(showSinglePlayer.bind(this, match.team2.player1))
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player2.username).click(showSinglePlayer.bind(this, match.team1.player2)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player2)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player2)),
                $('<td>').text(match.team2.player2.username).click(showSinglePlayer.bind(this, match.team2.player2))
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player3.username).click(showSinglePlayer.bind(this, match.team1.player3)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player3)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player3)),
                $('<td>').text(match.team2.player3.username).click(showSinglePlayer.bind(this, match.team2.player3))
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player4.username).click(showSinglePlayer.bind(this, match.team1.player4)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player4)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player4)),
                $('<td>').text(match.team2.player4.username).click(showSinglePlayer.bind(this, match.team2.player4))
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player5.username).click(showSinglePlayer.bind(this, match.team1.player5)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player5)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player5)),
                $('<td>').text(match.team2.player5.username).click(showSinglePlayer.bind(this, match.team2.player5))
            )).append($('<tr>').append(
                $('<td>').text(match.team1.player6.username).click(showSinglePlayer.bind(this, match.team1.player6)),
                $('<td>').text(match.team1.points).click(showSinglePlayer.bind(this, match.team1.player6)),
                $('<td>').text(match.team2.points).click(showSinglePlayer.bind(this, match.team2.player6)),
                $('<td>').text(match.team2.player6.username).click(showSinglePlayer.bind(this, match.team2.player6))
            ));

        $('#showSingleMatch').append(singleMatchTable).append(singleMatchPlayersTable);

        loadYoutybe(match);
    }

    function showSinglePlayer(player) {
        $('#viewSinglePlayer').empty();
        showView('viewSinglePlayer');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + player._id,
            headers: getKinveyUserAuthHeaders(),
            success: showSinglePlayerSuccess,
            error: handleAjaxError
        });

        function showSinglePlayerSuccess(player) {
            let singlePlayerTable = $('<table>')
                .append($('<tr>')).append(
                    $('<th>').text("Играч"),
                    $('<th>').text("Мачове"),
                    $('<th>').text("Победи"),
                    $('<th>').text("Равенства"),
                    $('<th>').text("Загуби"),
                    $('<th>').text("Точки")
                )
                .append($('<tr>')).append(
                    $('<td>').text(player.username),
                    $('<td>').text(player.playerstats.matches),
                    $('<td>').text(player.playerstats.wins),
                    $('<td>').text(player.playerstats.draws),
                    $('<td>').text(player.playerstats.losses),
                    $('<td>').text(player.playerstats.points)
                )
            $('#viewSinglePlayer').append(singlePlayerTable);
        }



            $.ajax({
                method: "GET",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches",
                headers: getKinveyUserAuthHeaders(),
                success: loadMatchesSuccess,
                error: handleAjaxError
            });


            function loadMatchesSuccess(matches) {

                matches.sort(function (a, b) {
                    return new Date(a.date) - new Date(b.date)
                });

                let playersMatches = []

                for (match of matches){
                    if(match.team1.player1._id==player._id ||
                        match.team1.player2._id==player._id ||
                        match.team1.player3._id==player._id ||
                        match.team1.player4._id==player._id ||
                        match.team1.player5._id==player._id ||
                        match.team1.player6._id==player._id ||
                        match.team2.player1._id==player._id ||
                        match.team2.player2._id==player._id ||
                        match.team2.player3._id==player._id ||
                        match.team2.player4._id==player._id ||
                        match.team2.player5._id==player._id ||
                        match.team2.player6._id==player._id
                    )
                    playersMatches.push(match)
                }

                let matchTable = $('<table>')
                    .append($('<tr>').append(
                        '<th>N</th>' +
                        '<th>Отбор 1</th>' +
                        '<th></th>' +
                        '<th></th>' +
                        '<th>Отбор 2</th>' +
                        '<th>Дата</th>'
                    ));
                let count = 1;
                for (let match of playersMatches) {
                    appendMatchRow(match, matchTable);
                }

                function appendMatchRow(match, matchTable) {

                    let editMatchLink = $('<a href="#">[Edit]</a>').click(editMatch.bind(this, match));
                    let showMatchLink = $('<a href="#"></a>').click(showSingleMatch.bind(this, match));


                    matchTable.append($('<tr>').append(
                        $('<td>').text(count).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team1.name).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team1.result).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team2.result).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.team2.name).click(showSingleMatch.bind(this, match)),
                        $('<td>').text(match.date).click(showSingleMatch.bind(this, match)),
                        $('<td>')
                            //.append(editMatchLink)
                    ));
                    count++
                }
                $('#viewSinglePlayer').append(matchTable);
            }
    }

    function addNewPlayerView() {

        $('#formAddNewPlayer').trigger('reset');
        showView('viewAddPlayer');
    }

    function addNewPlayer() {

        let userData = {
            username: $("#addNewPlayerUsername").val(),
            playerstats: {
                points: Number(0),
                rank: Number(1000),
                matches: Number(0),
                wins: Number(0),
                draws: Number(0),
                losses: Number(0)
            },
            _acl: {
                "creator": "user_id_1",
                "gr": true,
                "gw": false,
                "r": ["58b442530ca925073f345199"],
                "w": ["58b442530ca925073f345199"],
                "groups": {
                    "r": ["group_id_1", "group_id_5"],
                    "w": ["group_id_3", "group_id_4"]
                }
            }
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess() {
            $('#formAddNewPlayer').trigger('reset');
            showView('viewAddPlayer');
            showInfo('Успешна регистрация.');
            loadPlayersInSelect();
        }
    }

    function loadPlayersInSelect() {

        for (let i = $("#teamOnePlayerOne").has('option').length - 1; i >= 0; i--) {
            $("#teamOnePlayerOne, #teamOnePlayerTwo, #teamOnePlayerThree, #teamOnePlayerFour, #teamOnePlayerFive, #teamOnePlayerSix, " +
                "#teamTwoPlayerOne, #teamTwoPlayerTwo, #teamTwoPlayerThree, #teamTwoPlayerFour, #teamTwoPlayerFive, #teamTwoPlayerSix").find('option')
                .remove()
                .end();
        }


        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: getKinveyUserAuthHeaders(),
            success: loadUsersSuccess,
            error: handleAjaxError
        });

        function loadUsersSuccess(users) {
            for (let user of users) {

                $("#teamOnePlayerOne, #teamOnePlayerTwo, #teamOnePlayerThree, #teamOnePlayerFour, #teamOnePlayerFive, #teamOnePlayerSix, " +
                    "#teamTwoPlayerOne, #teamTwoPlayerTwo, #teamTwoPlayerThree, #teamTwoPlayerFour, #teamTwoPlayerFive, #teamTwoPlayerSix").append(
                    $('<option>')
                        .text(user.username)
                        .val(user._id)
                        .data("value", user)
                );
            }
        }
    }

    function calculateMatch(match) {

        let team1rank = Number(match.team1.player1.playerstats.rank) +
            Number(match.team1.player2.playerstats.rank) +
            Number(match.team1.player3.playerstats.rank) +
            Number(match.team1.player4.playerstats.rank) +
            Number(match.team1.player5.playerstats.rank) +
            Number(match.team1.player6.playerstats.rank);

        let team2rank = Number(match.team2.player1.playerstats.rank) +
            Number(match.team2.player2.playerstats.rank) +
            Number(match.team2.player3.playerstats.rank) +
            Number(match.team2.player4.playerstats.rank) +
            Number(match.team2.player5.playerstats.rank) +
            Number(match.team2.player6.playerstats.rank);


        let handicap = Math.round((Math.abs(team1rank - team2rank) / 50));

        let goalDifference = Math.abs(match.team1.result - match.team2.result);
        if (goalDifference > 5) {
            goalDifference = 5;
        }
        let rankDifference = Math.abs(team1rank - team2rank);
        if (rankDifference > 400) {
            rankDifference = 400;
        }

        let rankTeamOne = 0;
        let rankTeamTwo = 0;
        let pointsTeamOne = 0;
        let pointsTeamTwo = 0;
        let winsTeamOne = 0;
        let winsTeamTwo = 0;
        let drawsTeamOne = 0;
        let drawsTeamTwo = 0;
        let lossesTeamOne = 0;
        let lossesTeamTwo = 0;
        let coefficientTeamOne = 0;
        let coefficientTeamTwo = 0;


        if (team1rank > team2rank) {

            //checks only the handicapped result;
            if (Number(match.team1.result) > (Number(match.team2.result) + handicap)) {
                rankTeamOne = 10 + goalDifference - handicap;
                rankTeamTwo = -10 - goalDifference + handicap;
            }
            else if (Number(match.team1.result) < (Number(match.team2.result) + handicap)) {
                rankTeamOne = -10 - goalDifference - handicap;
                rankTeamTwo = 10 + goalDifference + handicap;
            }

            //checks the actual result;
            if (Number(match.team1.result) > Number(match.team2.result)) {
                winsTeamOne = 1;
                lossesTeamTwo = 1;
                coefficientTeamOne = 400 / (400 + rankDifference);
                coefficientTeamTwo = (400 + rankDifference) / 400;
                pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                updatePlayer();
            }
            else if (Number(match.team1.result) < Number(match.team2.result)) {
                winsTeamTwo = 1;
                lossesTeamOne = 1;
                coefficientTeamOne = 400 / (400 + rankDifference);
                coefficientTeamTwo = (400 + rankDifference) / 400;
                pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                updatePlayer();
            }
            else if (Number(match.team1.result) == Number(match.team2.result)) {
                drawsTeamOne = 1;
                drawsTeamTwo = 1;
                coefficientTeamOne = 400 / (400 + rankDifference);
                coefficientTeamTwo = (400 + rankDifference) / 400;
                pointsTeamOne = Math.round(5 * coefficientTeamOne);
                pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                updatePlayer();
            }
        }
        else if (team1rank < team2rank) {

            //checks the handicapped result only;
            if ((Number(match.team1.result) + handicap) > Number(match.team2.result)) {
                rankTeamOne = 10 + goalDifference + handicap;
                rankTeamTwo = -10 - goalDifference - handicap;
            }
            else if ((Number(match.team1.result) + handicap) < Number(match.team2.result)) {
                rankTeamOne = -10 - goalDifference + handicap;
                rankTeamTwo = 10 + goalDifference - handicap;
            }

            //checks the actual result;
            if (Number(match.team1.result) > Number(match.team2.result)) {
                winsTeamOne = 1;
                lossesTeamTwo = 1;
                coefficientTeamOne = (400 + rankDifference) / 400;
                coefficientTeamTwo = 400 / (400 + rankDifference);
                pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                updatePlayer();
            }
            else if (Number(match.team1.result) < Number(match.team2.result)) {
                winsTeamTwo = 1;
                lossesTeamOne = 1;
                coefficientTeamOne = (400 + rankDifference) / 400;
                coefficientTeamTwo = 400 / (400 + rankDifference);
                pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                updatePlayer();
            }

            else if (Number(match.team1.result) == Number(match.team2.result)) {
                drawsTeamOne = 1;
                drawsTeamTwo = 1;
                coefficientTeamOne = (400 + rankDifference) / 400;
                coefficientTeamTwo = 400 / (400 + rankDifference);
                pointsTeamOne = Math.round(5 * coefficientTeamOne);
                pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                updatePlayer();
            }
        }
        else if (team1rank == team2rank) {
            if (Number(match.team1.result) > Number(match.team2.result)) {
                rankTeamOne = 10 + goalDifference;
                rankTeamTwo = -10 - goalDifference;
            }
            else if (Number(match.team1.result) < Number(match.team2.result)) {
                rankTeamOne = -10 - goalDifference;
                rankTeamTwo = 10 + goalDifference;
            }

            //checks the actual result;
            if (Number(match.team1.result) > Number(match.team2.result)) {
                winsTeamOne = 1;
                lossesTeamTwo = 1;
                coefficientTeamOne = 1;
                coefficientTeamTwo = 1;
                pointsTeamOne = 10 + goalDifference;
                pointsTeamTwo = 5 - goalDifference;
                updatePlayer();
            }
            else if (Number(match.team1.result) < Number(match.team2.result)) {
                winsTeamTwo = 1;
                lossesTeamOne = 1;
                coefficientTeamOne = 1;
                coefficientTeamTwo = 1;
                pointsTeamOne = 5 - goalDifference;
                pointsTeamTwo = 10 + goalDifference;
                updatePlayer();
            }

            else if (Number(match.team1.result) == Number(match.team2.result)) {
                drawsTeamOne = 1;
                drawsTeamTwo = 1;
                coefficientTeamOne = 1;
                coefficientTeamTwo = 1;
                pointsTeamOne = 5;
                pointsTeamTwo = 5;
                updatePlayer();
            }
        }

        function updatePlayer() {

            let playersForUpdateTeam1 = [];
            let playersForUpdateTeam2 = [];

            playersForUpdateTeam1.push(match.team1.player1);
            playersForUpdateTeam1.push(match.team1.player2);
            playersForUpdateTeam1.push(match.team1.player3);
            playersForUpdateTeam1.push(match.team1.player4);
            playersForUpdateTeam1.push(match.team1.player5);
            playersForUpdateTeam1.push(match.team1.player6);

            playersForUpdateTeam2.push(match.team2.player1);
            playersForUpdateTeam2.push(match.team2.player2);
            playersForUpdateTeam2.push(match.team2.player3);
            playersForUpdateTeam2.push(match.team2.player4);
            playersForUpdateTeam2.push(match.team2.player5);
            playersForUpdateTeam2.push(match.team2.player6);

            for (let i = 0; i < 6; i++) {

                playersForUpdateTeam1[i].playerstats.rank = Number(playersForUpdateTeam1[i].playerstats.rank) + Number(rankTeamOne);
                playersForUpdateTeam1[i].playerstats.points = Number(playersForUpdateTeam1[i].playerstats.points) + Number(Math.round(pointsTeamOne));
                playersForUpdateTeam1[i].playerstats.matches = Number(playersForUpdateTeam1[i].playerstats.matches) + 1;
                playersForUpdateTeam1[i].playerstats.wins = Number(playersForUpdateTeam1[i].playerstats.wins) + Number(winsTeamOne);
                playersForUpdateTeam1[i].playerstats.draws = Number(playersForUpdateTeam1[i].playerstats.draws) + Number(drawsTeamOne);
                playersForUpdateTeam1[i].playerstats.losses = Number(playersForUpdateTeam1[i].playerstats.losses) + Number(lossesTeamOne);
                $.ajax({
                    method: "PUT",
                    url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + playersForUpdateTeam1[i]._id,
                    headers: getKinveyUserAuthHeaders(),
                    data: playersForUpdateTeam1[i],
                    success: console.log("success"),
                    error: handleAjaxError
                });
            }
            for (let i = 0; i < 6; i++) {
                playersForUpdateTeam2[i].playerstats.rank = Number(playersForUpdateTeam2[i].playerstats.rank) + Number(rankTeamTwo);
                playersForUpdateTeam2[i].playerstats.points = Number(playersForUpdateTeam2[i].playerstats.points) + Number(Math.round(pointsTeamTwo));
                playersForUpdateTeam2[i].playerstats.matches = Number(playersForUpdateTeam2[i].playerstats.matches) + 1;
                playersForUpdateTeam2[i].playerstats.wins = Number(playersForUpdateTeam2[i].playerstats.wins) + Number(winsTeamTwo);
                playersForUpdateTeam2[i].playerstats.draws = Number(playersForUpdateTeam2[i].playerstats.draws) + Number(drawsTeamTwo);
                playersForUpdateTeam2[i].playerstats.losses = Number(playersForUpdateTeam2[i].playerstats.losses) + Number(lossesTeamTwo);
                $.ajax({
                    method: "PUT",
                    url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + playersForUpdateTeam2[i]._id,
                    headers: getKinveyUserAuthHeaders(),
                    data: playersForUpdateTeam2[i],
                    success: console.log("success"),
                    error: handleAjaxError
                });
            }

        }


        console.log(rankDifference);
        console.log(handicap);
        console.log(typeof handicap);
        console.log(pointsTeamOne);
        console.log(pointsTeamTwo);


        match.team1.rank = Number(team1rank);
        match.team2.rank = Number(team2rank);
        match.team1.points = Number(pointsTeamOne);
        match.team2.points = Number(pointsTeamTwo);
        match.team1.coefficient = Number(coefficientTeamOne);
        match.team2.coefficient = Number(coefficientTeamTwo);

        console.log(match.team1.coefficient)
        console.log(match.team2.coefficient)

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches",
            //url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches/"+match._id,
            headers: getKinveyUserAuthHeaders(),
            data: match,
            success: console.log("success"),
            error: handleAjaxError
        });

    }

    function reCalculateAllMatches() {

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: getKinveyUserAuthHeaders(),
            success: loadUsersSuccess,
            error: handleAjaxError
        });

        let playersMap = new Map();

        function loadUsersSuccess(players) {

            for (let player of players) {

                player.playerstats.rank = 1000;
                player.playerstats.points = 0;
                player.playerstats.matches = 0;
                player.playerstats.wins = 0;
                player.playerstats.draws = 0;
                player.playerstats.losses = 0;

                playersMap.set(player._id, player);
            }

            for (let [k, v] of playersMap) {
                // console.log(k + ' -> ' + v.points);
            }

            $.ajax({
                method: "GET",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches",
                headers: getKinveyUserAuthHeaders(),
                success: loadMatchesSuccess,
                error: handleAjaxError
            });

            function loadMatchesSuccess(matches) {

                matches.sort(function (a, b) {
                    return new Date(a.date) - new Date(b.date)
                });

                for (let match of matches) {

                    match.team1.player1.playerstats = playersMap.get(match.team1.player1._id).playerstats;
                    match.team1.player2.playerstats = playersMap.get(match.team1.player2._id).playerstats;
                    match.team1.player3.playerstats = playersMap.get(match.team1.player3._id).playerstats;
                    match.team1.player4.playerstats = playersMap.get(match.team1.player4._id).playerstats;
                    match.team1.player5.playerstats = playersMap.get(match.team1.player5._id).playerstats;
                    match.team1.player6.playerstats = playersMap.get(match.team1.player6._id).playerstats;

                    match.team2.player1.playerstats = playersMap.get(match.team2.player1._id).playerstats;
                    match.team2.player2.playerstats = playersMap.get(match.team2.player2._id).playerstats;
                    match.team2.player3.playerstats = playersMap.get(match.team2.player3._id).playerstats;
                    match.team2.player4.playerstats = playersMap.get(match.team2.player4._id).playerstats;
                    match.team2.player5.playerstats = playersMap.get(match.team2.player5._id).playerstats;
                    match.team2.player6.playerstats = playersMap.get(match.team2.player6._id).playerstats;


                    //console.log(playersMap.get(match.team1.player1._id).playerstats.points)
                    //console.log(playersMap.get(match.team2.player1._id).playerstats.points)


                    let team1rank = Number(match.team1.player1.playerstats.rank) +
                        Number(match.team1.player2.playerstats.rank) +
                        Number(match.team1.player3.playerstats.rank) +
                        Number(match.team1.player4.playerstats.rank) +
                        Number(match.team1.player5.playerstats.rank) +
                        Number(match.team1.player6.playerstats.rank);

                    let team2rank = Number(match.team2.player1.playerstats.rank) +
                        Number(match.team2.player2.playerstats.rank) +
                        Number(match.team2.player3.playerstats.rank) +
                        Number(match.team2.player4.playerstats.rank) +
                        Number(match.team2.player5.playerstats.rank) +
                        Number(match.team2.player6.playerstats.rank);

                    //console.log(team1rank);
                    //console.log(team2rank)


                    let handicap = Math.round((Math.abs(team1rank - team2rank) / 50));

                    let goalDifference = Math.abs(match.team1.result - match.team2.result);
                    if (goalDifference > 5) {
                        goalDifference = 5;
                    }
                    let rankDifference = Math.abs(team1rank - team2rank);
                    if (rankDifference > 400) {
                        rankDifference = 400;
                    }

                    let rankTeamOne = 0;
                    let rankTeamTwo = 0;
                    let pointsTeamOne = 0;
                    let pointsTeamTwo = 0;
                    let winsTeamOne = 0;
                    let winsTeamTwo = 0;
                    let drawsTeamOne = 0;
                    let drawsTeamTwo = 0;
                    let lossesTeamOne = 0;
                    let lossesTeamTwo = 0;
                    let coefficientTeamOne = 0;
                    let coefficientTeamTwo = 0;

                    function updatePlayersMap() {

                        let playersForUpdateTeam1 = [];
                        let playersForUpdateTeam2 = [];

                        playersForUpdateTeam1.push(match.team1.player1);
                        playersForUpdateTeam1.push(match.team1.player2);
                        playersForUpdateTeam1.push(match.team1.player3);
                        playersForUpdateTeam1.push(match.team1.player4);
                        playersForUpdateTeam1.push(match.team1.player5);
                        playersForUpdateTeam1.push(match.team1.player6);

                        playersForUpdateTeam2.push(match.team2.player1);
                        playersForUpdateTeam2.push(match.team2.player2);
                        playersForUpdateTeam2.push(match.team2.player3);
                        playersForUpdateTeam2.push(match.team2.player4);
                        playersForUpdateTeam2.push(match.team2.player5);
                        playersForUpdateTeam2.push(match.team2.player6);

                        for (let i = 0; i < 6; i++) {
                            playersForUpdateTeam1[i].playerstats.rank = Number(playersForUpdateTeam1[i].playerstats.rank) + Number(rankTeamOne);
                            playersForUpdateTeam1[i].playerstats.points = Number(playersForUpdateTeam1[i].playerstats.points) + Number(Math.round(pointsTeamOne));
                            playersForUpdateTeam1[i].playerstats.matches = Number(playersForUpdateTeam1[i].playerstats.matches) + 1;
                            playersForUpdateTeam1[i].playerstats.wins = Number(playersForUpdateTeam1[i].playerstats.wins) + Number(winsTeamOne);
                            playersForUpdateTeam1[i].playerstats.draws = Number(playersForUpdateTeam1[i].playerstats.draws) + Number(drawsTeamOne);
                            playersForUpdateTeam1[i].playerstats.losses = Number(playersForUpdateTeam1[i].playerstats.losses) + Number(lossesTeamOne);

                            playersMap.set(playersForUpdateTeam1[i]._id, playersForUpdateTeam1[i]);
                        }

                        for (let i = 0; i < 6; i++) {
                            playersForUpdateTeam2[i].playerstats.rank = Number(playersForUpdateTeam2[i].playerstats.rank) + Number(rankTeamTwo);
                            playersForUpdateTeam2[i].playerstats.points = Number(playersForUpdateTeam2[i].playerstats.points) + Number(Math.round(pointsTeamTwo));
                            playersForUpdateTeam2[i].playerstats.matches = Number(playersForUpdateTeam2[i].playerstats.matches) + 1;
                            playersForUpdateTeam2[i].playerstats.wins = Number(playersForUpdateTeam2[i].playerstats.wins) + Number(winsTeamTwo);
                            playersForUpdateTeam2[i].playerstats.draws = Number(playersForUpdateTeam2[i].playerstats.draws) + Number(drawsTeamTwo);
                            playersForUpdateTeam2[i].playerstats.losses = Number(playersForUpdateTeam2[i].playerstats.losses) + Number(lossesTeamTwo);

                            playersMap.set(playersForUpdateTeam2[i]._id, playersForUpdateTeam2[i]);

                        }
                    }


                    if (team1rank > team2rank) {

                        //checks only the handicapped result;
                        if (Number(match.team1.result) > (Number(match.team2.result) + handicap)) {
                            rankTeamOne = 10 + goalDifference - handicap;
                            rankTeamTwo = -10 - goalDifference + handicap;
                        }
                        else if (Number(match.team1.result) < (Number(match.team2.result) + handicap)) {
                            rankTeamOne = -10 - goalDifference - handicap;
                            rankTeamTwo = 10 + goalDifference + handicap;
                        }

                        //checks the actual result;
                        if (Number(match.team1.result) > Number(match.team2.result)) {
                            winsTeamOne = 1;
                            lossesTeamTwo = 1;
                            coefficientTeamOne = 400 / (400 + rankDifference);
                            coefficientTeamTwo = (400 + rankDifference) / 400;
                            pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                            pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                            updatePlayersMap();
                        }
                        else if (Number(match.team1.result) < Number(match.team2.result)) {
                            winsTeamTwo = 1;
                            lossesTeamOne = 1;
                            coefficientTeamOne = 400 / (400 + rankDifference);
                            coefficientTeamTwo = (400 + rankDifference) / 400;
                            pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                            pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                            updatePlayersMap();
                        }
                        else if (Number(match.team1.result) == Number(match.team2.result)) {
                            drawsTeamOne = 1;
                            drawsTeamTwo = 1;
                            coefficientTeamOne = 400 / (400 + rankDifference);
                            coefficientTeamTwo = (400 + rankDifference) / 400;
                            pointsTeamOne = Math.round(5 * coefficientTeamOne);
                            pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                            updatePlayersMap();
                        }
                    }
                    else if (team1rank < team2rank) {

                        //checks the handicapped result only;
                        if ((Number(match.team1.result) + handicap) > Number(match.team2.result)) {
                            rankTeamOne = 10 + goalDifference + handicap;
                            rankTeamTwo = -10 - goalDifference - handicap;
                        }
                        else if ((Number(match.team1.result) + handicap) < Number(match.team2.result)) {
                            rankTeamOne = -10 - goalDifference + handicap;
                            rankTeamTwo = 10 + goalDifference - handicap;
                        }

                        //checks the actual result;
                        if (Number(match.team1.result) > Number(match.team2.result)) {
                            winsTeamOne = 1;
                            lossesTeamTwo = 1;
                            coefficientTeamOne = (400 + rankDifference) / 400;
                            coefficientTeamTwo = 400 / (400 + rankDifference);
                            pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                            pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                            updatePlayersMap();
                        }
                        else if (Number(match.team1.result) < Number(match.team2.result)) {
                            winsTeamTwo = 1;
                            lossesTeamOne = 1;
                            coefficientTeamOne = (400 + rankDifference) / 400;
                            coefficientTeamTwo = 400 / (400 + rankDifference);
                            pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                            pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                            updatePlayersMap();
                        }

                        else if (Number(match.team1.result) == Number(match.team2.result)) {
                            drawsTeamOne = 1;
                            drawsTeamTwo = 1;
                            coefficientTeamOne = (400 + rankDifference) / 400;
                            coefficientTeamTwo = 400 / (400 + rankDifference);
                            pointsTeamOne = Math.round(5 * coefficientTeamOne);
                            pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                            updatePlayersMap();
                        }
                    }
                    else if (team1rank == team2rank) {
                        if (Number(match.team1.result) > Number(match.team2.result)) {
                            rankTeamOne = 10 + goalDifference;
                            rankTeamTwo = -10 - goalDifference;
                        }
                        else if (Number(match.team1.result) < Number(match.team2.result)) {
                            rankTeamOne = -10 - goalDifference;
                            rankTeamTwo = 10 + goalDifference;
                        }

                        //checks the actual result;
                        if (Number(match.team1.result) > Number(match.team2.result)) {
                            winsTeamOne = 1;
                            lossesTeamTwo = 1;
                            coefficientTeamOne = 1;
                            coefficientTeamTwo = 1;
                            pointsTeamOne = 10 + goalDifference;
                            pointsTeamTwo = 5 - goalDifference;
                            updatePlayersMap();
                        }
                        else if (Number(match.team1.result) < Number(match.team2.result)) {
                            winsTeamTwo = 1;
                            lossesTeamOne = 1;
                            coefficientTeamOne = 1;
                            coefficientTeamTwo = 1;
                            pointsTeamOne = 5 - goalDifference;
                            pointsTeamTwo = 10 + goalDifference;
                            updatePlayersMap();
                        }

                        else if (Number(match.team1.result) == Number(match.team2.result)) {
                            drawsTeamOne = 1;
                            drawsTeamTwo = 1;
                            coefficientTeamOne = 1;
                            coefficientTeamTwo = 1;
                            pointsTeamOne = 5;
                            pointsTeamTwo = 5;
                            updatePlayersMap();
                        }
                    }


                    match.team1.rank = Number(team1rank);
                    match.team2.rank = Number(team2rank);
                    match.team1.points = Number(pointsTeamOne);
                    match.team2.points = Number(pointsTeamTwo);
                    match.team1.coefficient = Number(coefficientTeamOne);
                    match.team2.coefficient = Number(coefficientTeamTwo);


                }

                for (let match of matches) {
                    $.ajax({
                        method: "PUT",
                        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/matches/" + match._id,
                        headers: getKinveyUserAuthHeaders(),
                        data: match,
                        success: "",
                        error: handleAjaxError
                    });
                }

                let updatedPlayers = [];

                for (let [k, v] of playersMap) {
                    updatedPlayers.push(v);
                }

                for (let player of updatedPlayers) {
                    $.ajax({
                        method: "PUT",
                        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + player._id,
                        headers: getKinveyUserAuthHeaders(),
                        data: player,
                        success: "",
                        error: handleAjaxError
                    });
                }
            }
        }
    }

    function loadYoutybe(match) {
        console.log(match.video)

        // 2. This code loads the IFrame Player API code asynchronously.


        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        function onYouTubeIframeAPIReady() {
            let player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: 'wvfbPtnLL6k',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            console.log("onYouTubeIframeAPIReady")
        }

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
            event.target.playVideo();
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
                setTimeout(stopVideo, 0);
                done = true;
            }
        }
        function stopVideo() {
            player.stopVideo();
        }

    }

    function autocomplete() {

        $(function () {
            $.widget("custom.combobox", {
                _create: function () {
                    this.wrapper = $("<span>")
                        .addClass("custom-combobox")
                        .insertAfter(this.element);

                    this.element.hide();
                    this._createAutocomplete();
                    this._createShowAllButton();
                },

                _createAutocomplete: function () {
                    var selected = this.element.children(":selected"),
                        value = selected.val() ? selected.text() : "";

                    this.input = $("<input>")
                        .appendTo(this.wrapper)
                        .val(value)
                        .attr("title", "")
                        .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                        .autocomplete({
                            delay: 0,
                            minLength: 0,
                            source: $.proxy(this, "_source")
                        })
                        .tooltip({
                            classes: {
                                "ui-tooltip": "ui-state-highlight"
                            }
                        });

                    this._on(this.input, {
                        autocompleteselect: function (event, ui) {
                            ui.item.option.selected = true;
                            this._trigger("select", event, {
                                item: ui.item.option
                            });
                        },

                        autocompletechange: "_removeIfInvalid"
                    });
                },

                _createShowAllButton: function () {
                    var input = this.input,
                        wasOpen = false;

                    $("<a>")
                        .attr("tabIndex", -1)
                        .attr("title", "Show All Items")
                        .tooltip()
                        .appendTo(this.wrapper)
                        .button({
                            icons: {
                                primary: "ui-icon-triangle-1-s"
                            },
                            text: false
                        })
                        .removeClass("ui-corner-all")
                        .addClass("custom-combobox-toggle ui-corner-right")
                        .on("mousedown", function () {
                            wasOpen = input.autocomplete("widget").is(":visible");
                        })
                        .on("click", function () {
                            input.trigger("focus");

                            // Close if already visible
                            if (wasOpen) {
                                return;
                            }

                            // Pass empty string as value to search for, displaying all results
                            input.autocomplete("search", "");
                        });
                },

                _source: function (request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(this.element.children("option").map(function () {
                        var text = $(this).text();
                        if (this.value && ( !request.term || matcher.test(text) ))
                            return {
                                label: text,
                                value: text,
                                option: this
                            };
                    }));
                },

                _removeIfInvalid: function (event, ui) {

                    // Selected an item, nothing to do
                    if (ui.item) {
                        return;
                    }

                    // Search for a match (case-insensitive)
                    var value = this.input.val(),
                        valueLowerCase = value.toLowerCase(),
                        valid = false;
                    this.element.children("option").each(function () {
                        if ($(this).text().toLowerCase() === valueLowerCase) {
                            this.selected = valid = true;
                            return false;
                        }
                    });

                    // Found a match, nothing to do
                    if (valid) {
                        return;
                    }

                    // Remove invalid value
                    this.input
                        .val("")
                        .attr("title", value + " didn't match any item")
                        .tooltip("open");
                    this.element.val("");
                    this._delay(function () {
                        this.input.tooltip("close").attr("title", "");
                    }, 2500);
                    this.input.autocomplete("instance").term = "";
                },

                _destroy: function () {
                    this.wrapper.remove();
                    this.element.show();
                }
            });

            $("#teamOnePlayerOne, #teamOnePlayerTwo, #teamOnePlayerThree, #teamOnePlayerFour, #teamOnePlayerFive, #teamOnePlayerSix, " +
                "#teamTwoPlayerOne, #teamTwoPlayerTwo, #teamTwoPlayerThree, #teamTwoPlayerFour, #teamTwoPlayerFive, #teamTwoPlayerSix").combobox();

        });
    }

    function jQueryAutocomplete() {

        $(function () {
            var availableTags = [
                "ActionScript",
                "AppleScript",
                "Asp",
                "BASIC",
                "C",
                "C++",
                "Clojure",
                "COBOL",
                "ColdFusion",
                "Erlang",
                "Fortran",
                "Groovy",
                "Haskell",
                "Java",
                "JavaScript",
                "Lisp",
                "Perl",
                "PHP",
                "Python",
                "Ruby",
                "Scala",
                "Scheme"
            ];
            $("#teamOnePlayerOne, #teamOnePlayerTwo, #teamOnePlayerThree, #teamOnePlayerFour, #teamOnePlayerFive, #teamOnePlayerSix, " +
                "#teamTwoPlayerOne, #teamTwoPlayerTwo, #teamTwoPlayerThree, #teamTwoPlayerFour, #teamTwoPlayerFive, #teamTwoPlayerSix").autocomplete({
                source: loadPlayersInSelect()
            });
        });
    }

    function dateTimePicker() {
        $.datetimepicker.setLocale('en');

        $('#datetimepicker_format').datetimepicker({
            value: '2015/04/15 05:03',
            format: $("#datetimepicker_format_value").val()
        });
        console.log($('#datetimepicker_format').datetimepicker('getValue'));

        $("#datetimepicker_format_change").on("click", function (e) {
            $("#datetimepicker_format").data('xdsoft_datetimepicker').setOptions({format: $("#datetimepicker_format_value").val()});
        });
        $("#datetimepicker_format_locale").on("change", function (e) {
            $.datetimepicker.setLocale($(e.currentTarget).val());
        });

        $('#datetimepicker').datetimepicker({
            dayOfWeekStart: 1,
            lang: 'en',
            disabledDates: ['1986/01/08', '1986/01/09', '1986/01/10'],
            startDate: '1986/01/05'
        });
        $('#datetimepicker').datetimepicker({value: '2015/04/15 05:03', step: 10});

        $('.some_class').datetimepicker();

        $('#default_datetimepicker').datetimepicker({
            formatTime: 'H:i',
            formatDate: 'd.m.Y',
            //defaultDate:'8.12.1986', // it's my birthday
            defaultDate: '+03.01.1970', // it's my birthday
            defaultTime: '10:00',
            timepickerScrollbar: false
        });

        $('#datetimepicker10').datetimepicker({
            step: 5,
            inline: true
        });
        $('#datetimepicker_mask').datetimepicker({
            mask: '9999/19/39 29:59'
        });

        $('#datetimepicker1').datetimepicker({
            datepicker: false,
            format: 'H:i',
            step: 5
        });
        $('#datetimepicker2').datetimepicker({
            yearOffset: 222,
            lang: 'ch',
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'Y/m/d',
            minDate: '-1970/01/02', // yesterday is minimum date
            maxDate: '+1970/01/02' // and tommorow is maximum date calendar
        });
        $('#datetimepicker3').datetimepicker({
            inline: true
        });
        $('#datetimepicker4').datetimepicker();
        $('#open').click(function () {
            $('#datetimepicker4').datetimepicker('show');
        });
        $('#close').click(function () {
            $('#datetimepicker4').datetimepicker('hide');
        });
        $('#reset').click(function () {
            $('#datetimepicker4').datetimepicker('reset');
        });
        $('#datetimepicker5').datetimepicker({
            datepicker: false,
            allowTimes: ['12:00', '13:00', '15:00', '17:00', '17:05', '17:20', '19:00', '20:00'],
            step: 5
        });
        $('#datetimepicker6').datetimepicker();
        $('#destroy').click(function () {
            if ($('#datetimepicker6').data('xdsoft_datetimepicker')) {
                $('#datetimepicker6').datetimepicker('destroy');
                this.value = 'create';
            } else {
                $('#datetimepicker6').datetimepicker();
                this.value = 'destroy';
            }
        });
        var logic = function (currentDateTime) {
            if (currentDateTime && currentDateTime.getDay() == 6) {
                this.setOptions({
                    minTime: '11:00'
                });
            } else
                this.setOptions({
                    minTime: '8:00'
                });
        };
        $('#datetimepicker7').datetimepicker({
            onChangeDateTime: logic,
            onShow: logic
        });
        $('#datetimepicker8').datetimepicker({
            onGenerate: function (ct) {
                $(this).find('.xdsoft_date')
                    .toggleClass('xdsoft_disabled');
            },
            minDate: '-1970/01/2',
            maxDate: '+1970/01/2',
            timepicker: false
        });
        $('#datetimepicker9').datetimepicker({
            onGenerate: function (ct) {
                $(this).find('.xdsoft_date.xdsoft_weekend')
                    .addClass('xdsoft_disabled');
            },
            weekends: ['01.01.2014', '02.01.2014', '03.01.2014', '04.01.2014', '05.01.2014', '06.01.2014'],
            timepicker: false
        });
        var dateToDisable = new Date();
        dateToDisable.setDate(dateToDisable.getDate() + 2);
        $('#datetimepicker11').datetimepicker({
            beforeShowDay: function (date) {
                if (date.getMonth() == dateToDisable.getMonth() && date.getDate() == dateToDisable.getDate()) {
                    return [false, ""]
                }

                return [true, ""];
            }
        });
        $('#datetimepicker12').datetimepicker({
            beforeShowDay: function (date) {
                if (date.getMonth() == dateToDisable.getMonth() && date.getDate() == dateToDisable.getDate()) {
                    return [true, "custom-date-style"];
                }

                return [true, ""];
            }
        });
        $('#datetimepicker_dark').datetimepicker({theme: 'dark'})
    }

}