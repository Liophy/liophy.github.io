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
    showView('viewAppHome');
    loginUser();

    $("#linkMenuAppHome").click(showHomeView);
    $("#linkMenuRules").click(showRulesView);
    $("#linkMenuAllMatches").click(listAllMatches);
    $("#linkMenuAllPlayers").click(listAllPlayers);
    $("#linkMenuRankings2017").click(listRanking2017);
    $("#linkMenuRankings2018").click(listRanking2018);


    $("#infoBox, #errorBox").click(function () {
        $(this).fadeOut();
    });


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

    function showRulesView() {
        showView('viewRules');
    }

    function showHomeViewUser() {
        showView('viewUserHome');
    }

    function getKinveyUserAuthHeaders() {
        return {
            "Authorization": "Kinvey " + sessionStorage.getItem("authToken")
        }
    }

    function loginUser() {
        let userData = {
            username: " ",
            password: "messikolibes1",

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
                return new Date(b.date) - new Date(a.date)
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

                    //let editMatchLink = $('<a href="#">[Edit]</a>').click(editMatch.bind(this, match));
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
                if (Number(a.playerstats.points) < Number(b.playerstats.points))
                    return 1;
                if (Number(a.playerstats.points) > Number(b.playerstats.points))
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
                    '<th>Мачове</th>' +
                    '<th>Победи</th>' +
                    '<th>Равни</th>' +
                    '<th>Загуби</th>'+
                    '<th>Точки</th>'
                ));
            $('#viewAllPlayers').append(playersTable);
            let count = 1;


            for (let player of players) {
                appendPlayerRow(player, playersTable);
                count++;
            }

            function appendPlayerRow(player, playersTable) {

                playersTable.append($('<tr>').append(
                    $('<td>').text(count),
                    $('<td>').text(player.username).click(showSinglePlayer.bind(this, player)),
                    $('<td>').text(player.playerstats.matches),
                    $('<td>').text(player.playerstats.wins),
                    $('<td>').text(player.playerstats.draws),
                    $('<td>').text(player.playerstats.losses),
                    $('<td>').text(player.playerstats.points)
                ));
            }
        }
    }

    function listRanking2017() {
        showView('viewAllPlayers');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: getKinveyUserAuthHeaders(),
            success: loadUsersSuccess,
            error: handleAjaxError
        });

        function loadUsersSuccess(players) {

            function compareRang(a, b) {
                if (Number(a.rank) < Number(b.rank))
                    return 1;
                if (Number(a.rank) > Number(b.rank))
                    return -1;
                return 0;
            }
            function compareName(a,b){
                if (Number(a.name) < Number(b.name))
                    return 1;
                if (Number(a.name) > Number(b.name))
                    return -1;
                return 0;
            }
            function comparePoints(a,b){
                if (Number(a.playerstats2017.points) < Number(b.playerstats2017.points))
                    return 1;
                if (Number(a.playerstats2017.points) > Number(b.playerstats2017.points))
                    return -1;
                return 0;
            }
            function comparePointsPerGame(a,b){
                if (Number(a.playerstats.points/a.playerstats.matches) < Number(b.playerstats.points/b.playerstats.matches))
                    return 1;
                if (Number(a.playerstats.points/a.playerstats.matches) > Number(b.playerstats.points/b.playerstats.matches))
                    return -1;
                return 0;
            }

            players.sort(comparePoints);

            //showInfo('Players loaded');
            $('#viewAllPlayers').empty();

            let playersTable = $('<table>')
                .append($('<tr>').append(
                    '<th>N</th>'+
                    ('<th>Име</th>')+
                    '<th>Мачове</th>' +
                    '<th>Победи</th>' +
                    '<th>Равни</th>' +
                    '<th>Загуби</th>' +
                    ('<th>Точки</th>')
                ));
            $('#viewAllPlayers').append(playersTable);
            let count = 1;




            for (let player of players) {
                if(player.playerstats2017.points>0){
                    appendPlayerRow(player, playersTable);
                    count++;
                }

            }

            function appendPlayerRow(player, playersTable) {


                playersTable.append($('<tr>').append(
                    $('<td>').text(count),
                    $('<td>').text(player.username).click(showSinglePlayer.bind(this, player)),
                    $('<td>').text(player.playerstats2017.matches),
                    $('<td>').text(player.playerstats2017.wins),
                    $('<td>').text(player.playerstats2017.draws),
                    $('<td>').text(player.playerstats2017.losses),
                    $('<td>').text(player.playerstats2017.points)
                ));
            }
        }
    }

    function listRanking2018() {
        showView('viewAllPlayers');

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "user/" + kinveyAppKey,
            headers: getKinveyUserAuthHeaders(),
            success: loadUsersSuccess,
            error: handleAjaxError
        });

        function loadUsersSuccess(players) {

            function compareRang(a, b) {
                if (Number(a.rank) < Number(b.rank))
                    return 1;
                if (Number(a.rank) > Number(b.rank))
                    return -1;
                return 0;
            }
            function compareName(a,b){
                if (Number(a.name) < Number(b.name))
                    return 1;
                if (Number(a.name) > Number(b.name))
                    return -1;
                return 0;
            }
            function comparePoints(a,b){
                if (Number(a.playerstats2018.points) < Number(b.playerstats2018.points))
                    return 1;
                if (Number(a.playerstats2018.points) > Number(b.playerstats2018.points))
                    return -1;
                return 0;
            }
            function comparePointsPerGame(a,b){
                if (Number(a.playerstats.points/a.playerstats.matches) < Number(b.playerstats.points/b.playerstats.matches))
                    return 1;
                if (Number(a.playerstats.points/a.playerstats.matches) > Number(b.playerstats.points/b.playerstats.matches))
                    return -1;
                return 0;
            }

            players.sort(comparePoints);

            //showInfo('Players loaded');
            $('#viewAllPlayers').empty();

            let playersTable = $('<table>')
                .append($('<tr>').append(
                    '<th>N</th>'+
                    ('<th>Име</th>')+
                    '<th>Мачове</th>' +
                    '<th>Победи</th>' +
                    '<th>Равни</th>' +
                    '<th>Загуби</th>' +
                    ('<th>Точки</th>')
                ));
            $('#viewAllPlayers').append(playersTable);
            let count = 1;




            for (let player of players) {
                if(player.playerstats2018.points>0){
                    appendPlayerRow(player, playersTable);
                    count++;
                }
            }

            function appendPlayerRow(player, playersTable) {


                playersTable.append($('<tr>').append(
                    $('<td>').text(count),
                    $('<td>').text(player.username).click(showSinglePlayer.bind(this, player)),
                    $('<td>').text(player.playerstats2018.matches),
                    $('<td>').text(player.playerstats2018.wins),
                    $('<td>').text(player.playerstats2018.draws),
                    $('<td>').text(player.playerstats2018.losses),
                    $('<td>').text(player.playerstats2018.points)
                ));
            }
        }
    }

    function showSingleMatch(match) {
        $('#showSingleMatch').empty();
        showView('viewSingleMatch');
        $('#showSingleMatch').append($('<div>', {id: 'player'}))



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



        let player = new YT.Player ('player', {
            height: '390',
            width: '640',
            videoId: match.video,
        });



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
            let name = $('<div class="single-player-view-name">').text(player.username);

            let singlePlayerTable = $('<table>')
                .append($('<tr>')).append(
                    $('<th>').text("Сезон"),
                    $('<th>').text("Мачове"),
                    $('<th>').text("Победи"),
                    $('<th>').text("Равенства"),
                    $('<th>').text("Загуби"),
                    $('<th>').text("Точки")
                )
                .append($('<tr>')).append(
                    $('<td>').text("2017"),
                    $('<td>').text(player.playerstats2017.matches),
                    $('<td>').text(player.playerstats2017.wins),
                    $('<td>').text(player.playerstats2017.draws),
                    $('<td>').text(player.playerstats2017.losses),
                    $('<td>').text(player.playerstats2017.points)
                )
                .append($('<tr>')).append(
                    $('<td>').text("2018"),
                    $('<td>').text(player.playerstats2018.matches),
                    $('<td>').text(player.playerstats2018.wins),
                    $('<td>').text(player.playerstats2018.draws),
                    $('<td>').text(player.playerstats2018.losses),
                    $('<td>').text(player.playerstats2018.points)
                )
            $('#viewSinglePlayer').append(name).append(singlePlayerTable);
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
                    '<th>Дата</th>'+
                    '<th>Изход</th>'
                ));
            let count = 1;
            let outcome = "";
            for (let match of playersMatches) {
                appendMatchRow(match, matchTable);
            }

            function appendMatchRow(match, matchTable) {

                //let editMatchLink = $('<a href="#">[Edit]</a>').click(editMatch.bind(this, match));
                let showMatchLink = $('<a href="#"></a>').click(showSingleMatch.bind(this, match));

                if(match.team1.player1._id==player._id ||
                    match.team1.player2._id==player._id ||
                    match.team1.player3._id==player._id ||
                    match.team1.player4._id==player._id ||
                    match.team1.player5._id==player._id ||
                    match.team1.player6._id==player._id){
                    if(Number(match.team1.result) > Number(match.team2.result)){
                        outcome = "Победа"
                    }
                    else if (Number(match.team1.result) == Number(match.team2.result)){
                        outcome = "Равенство"
                    }

                    else if(Number(match.team1.result) < Number(match.team2.result)){
                        outcome = "Загуба"
                    }

                }
                else {
                    if(Number(match.team1.result) > Number(match.team2.result)){
                        outcome = "Загуба"
                    }
                    else if (Number(match.team1.result) == Number(match.team2.result)){
                        outcome = "Равенство"
                    }

                    else if(Number(match.team1.result) < Number(match.team2.result)){
                        outcome = "Победа"
                    }

                }


                matchTable.append($('<tr>').append(
                    $('<td>').text(count).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(match.team1.name).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(match.team1.result).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(match.team2.result).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(match.team2.name).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(match.date).click(showSingleMatch.bind(this, match)),
                    $('<td>').text(outcome).click(showSingleMatch.bind(this, match))

                    //.append(editMatchLink)
                ));

                count++
            }
            let textdiv = $('<div class="single-player-view-name">').text("Мачове");
            $('#viewSinglePlayer').append(textdiv).append(matchTable);
        }
    }

}