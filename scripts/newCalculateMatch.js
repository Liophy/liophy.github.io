function newCalculateMatch(match) {

    let teamOneRank = Number(match.team1.player1.rank) +
                      Number(match.team1.player2.rank) +
                      Number(match.team1.player3.rank) +
                      Number(match.team1.player4.rank) +
                      Number(match.team1.player5.rank) +
                      Number(match.team1.player6.rank);

    let teamTwoRank = Number(match.team2.player1.rank) +
                      Number(match.team2.player2.rank) +
                      Number(match.team2.player3.rank) +
                      Number(match.team2.player4.rank) +
                      Number(match.team2.player5.rank) +
                      Number(match.team2.player6.rank);
        
    match.team1.player1.points = 0;
    match.team1.player2.points = 0;
    match.team1.player3.points = 0;
    match.team1.player4.points = 0;
    match.team1.player5.points = 0;
    match.team1.player6.points = 0;
    match.team2.player1.points = 0;
    match.team2.player2.points = 0;
    match.team2.player3.points = 0;
    match.team2.player4.points = 0;
    match.team2.player5.points = 0;
    match.team2.player6.points = 0;
    



        for (let i = 1; i < 7; i++){
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

            let team1rank = (teamOneRank - Number(match.team1["player" +i].rank))*1.2;
            let team2rank = teamTwoRank;
            let handicap = Math.round((Math.abs(team1rank - team2rank)) / 5);
            let goalDifference = Math.abs(match.team1.result - match.team2.result);
            if (goalDifference > 5) {
                goalDifference = 5;
            }
            let rankDifference = Math.abs(team1rank - team2rank);
            if (rankDifference > 30) {
                rankDifference = 30;
            }
            console.log(`team1rank=  ${team1rank}`)

            if (team1rank > team2rank) {
                //checks only the handicapped result;
                if (Number(match.team1.result) > (Number(match.team2.result) + handicap)) {
                    rankTeamOne =  goalDifference - handicap;
                    rankTeamTwo = - goalDifference + handicap;
                }
                else if (Number(match.team1.result) < (Number(match.team2.result) + handicap)) {
                    rankTeamOne =  - goalDifference - handicap;
                    rankTeamTwo =  goalDifference + handicap;
                }
        
                //checks the actual result;
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    winsTeamOne = 1;
                    lossesTeamTwo = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    winsTeamTwo = 1;
                    lossesTeamOne = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) == Number(match.team2.result)) {
                    drawsTeamOne = 1;
                    drawsTeamTwo = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round(5 * coefficientTeamOne);
                    pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                    updatePlayer();
                }
            }
            else if (team1rank < team2rank) {
        
                //checks the handicapped result only;
                if ((Number(match.team1.result) + handicap) > Number(match.team2.result)) {
                    rankTeamOne = goalDifference + handicap;
                    rankTeamTwo = - goalDifference - handicap;
                }
                else if ((Number(match.team1.result) + handicap) < Number(match.team2.result)) {
                    rankTeamOne = - goalDifference + handicap;
                    rankTeamTwo = + goalDifference - handicap;
                }
        
                //checks the actual result;
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    winsTeamOne = 1;
                    lossesTeamTwo = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    winsTeamTwo = 1;
                    lossesTeamOne = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
        
                else if (Number(match.team1.result) == Number(match.team2.result)) {
                    drawsTeamOne = 1;
                    drawsTeamTwo = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round(5 * coefficientTeamOne);
                    pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                    updatePlayer();
                }
            }
            else if (team1rank == team2rank) {
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    rankTeamOne = + goalDifference;
                    rankTeamTwo = - goalDifference;
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    rankTeamOne = - goalDifference;
                    rankTeamTwo = + goalDifference;
                }
        
                //checks the actual result;
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    winsTeamOne = 1;
                    lossesTeamTwo = 1;
                    pointsTeamOne = 10 + goalDifference;
                    pointsTeamTwo = 5 - goalDifference;
                    updatePlayer();
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    winsTeamTwo = 1;
                    lossesTeamOne = 1;
                    pointsTeamOne = 5 - goalDifference;
                    pointsTeamTwo = 10 + goalDifference;
                    updatePlayer();
                }
        
                else if (Number(match.team1.result) == Number(match.team2.result)) {
                    drawsTeamOne = 1;
                    drawsTeamTwo = 1;
                    pointsTeamOne = 5;
                    pointsTeamTwo = 5;
                    updatePlayer();
                }
            }
            match.team1["player" +i].points = Number(Math.round(pointsTeamOne));

            function updatePlayer() {
                    match.team1["player" +i].rank = Number(match.team1["player" +i].rank) + Number(rankTeamOne);
                    match.team1["player" +i].playerstats2019.points = Number(match.team1["player" +i].playerstats2019.points) + Number(Math.round(pointsTeamOne));
                    match.team1["player" +i].playerstats2019.matches = Number(match.team1["player" +i].playerstats2019.matches) + 1;
                    match.team1["player" +i].playerstats2019.wins = Number(match.team1["player" +i].playerstats2019.wins) + Number(winsTeamOne);
                    match.team1["player" +i].playerstats2019.draws = Number(match.team1["player" +i].playerstats2019.draws) + Number(drawsTeamOne);
                    match.team1["player" +i].playerstats2019.losses = Number(match.team1["player" +i].playerstats2019.losses) + Number(lossesTeamOne);
                    $.ajax({
                        method: "PUT",
                        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + match.team1["player" +i]._id,
                        headers: getKinveyUserAuthHeaders(),
                        data: match.team1["player" +i],
                        error: handleAjaxError
                    });
                }      
            }
    

        for (let i = 1; i < 7; i++){
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

            let team2rank = (teamTwoRank - Number(match.team2["player" +i].rank))*1.2;
            let team1rank = teamOneRank;
            let handicap = Math.round((Math.abs(team1rank - team2rank)) / 5);
            let goalDifference = Math.abs(match.team1.result - match.team2.result);
            if (goalDifference > 5) {
                goalDifference = 5;
            }
            let rankDifference = Math.abs(team1rank - team2rank);
            if (rankDifference > 30) {
                rankDifference = 30;
            }


            if (team1rank > team2rank) {
                //checks only the handicapped result;
                if (Number(match.team1.result) > (Number(match.team2.result) + handicap)) {
                    rankTeamOne =  goalDifference - handicap;
                    rankTeamTwo = - goalDifference + handicap;
                }
                else if (Number(match.team1.result) < (Number(match.team2.result) + handicap)) {
                    rankTeamOne =  - goalDifference - handicap;
                    rankTeamTwo =  goalDifference + handicap;
                }
        
                //checks the actual result;
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    winsTeamOne = 1;
                    lossesTeamTwo = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    winsTeamTwo = 1;
                    lossesTeamOne = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) == Number(match.team2.result)) {
                    drawsTeamOne = 1;
                    drawsTeamTwo = 1;
                    coefficientTeamOne = 15 / (15 + rankDifference);
                    coefficientTeamTwo = (15 + rankDifference) / 15;
                    pointsTeamOne = Math.round(5 * coefficientTeamOne);
                    pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                    updatePlayer();
                }
            }
            else if (team1rank < team2rank) {
        
                //checks the handicapped result only;
                if ((Number(match.team1.result) + handicap) > Number(match.team2.result)) {
                    rankTeamOne = goalDifference + handicap;
                    rankTeamTwo = - goalDifference - handicap;
                }
                else if ((Number(match.team1.result) + handicap) < Number(match.team2.result)) {
                    rankTeamOne = - goalDifference + handicap;
                    rankTeamTwo = + goalDifference - handicap;
                }
        
                //checks the actual result;
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    winsTeamOne = 1;
                    lossesTeamTwo = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round((10 + goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((5 - goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    winsTeamTwo = 1;
                    lossesTeamOne = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round((5 - goalDifference) * coefficientTeamOne);
                    pointsTeamTwo = Math.round((10 + goalDifference) * coefficientTeamTwo);
                    updatePlayer();
                }
        
                else if (Number(match.team1.result) == Number(match.team2.result)) {
                    drawsTeamOne = 1;
                    drawsTeamTwo = 1;
                    coefficientTeamOne = (15 + rankDifference) / 15;
                    coefficientTeamTwo = 15 / (15 + rankDifference);
                    pointsTeamOne = Math.round(5 * coefficientTeamOne);
                    pointsTeamTwo = Math.round(5 * coefficientTeamTwo);
                    updatePlayer();
                }
            }
            else if (team1rank == team2rank) {
                if (Number(match.team1.result) > Number(match.team2.result)) {
                    rankTeamOne = goalDifference;
                    rankTeamTwo = - goalDifference;
                }
                else if (Number(match.team1.result) < Number(match.team2.result)) {
                    rankTeamOne = - goalDifference;
                    rankTeamTwo = goalDifference;
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
            match.team2["player" +i].points = Number(Math.round(pointsTeamTwo));

            function updatePlayer() {
                    match.team2["player" +i].rank = Number(match.team2["player" +i].rank) + Number(rankTeamTwo);
                    match.team2["player" +i].playerstats2019.points = Number(match.team2["player" +i].playerstats2019.points) + Number(Math.round(pointsTeamTwo));
                    match.team2["player" +i].playerstats2019.matches = Number(match.team2["player" +i].playerstats2019.matches) + 1;
                    match.team2["player" +i].playerstats2019.wins = Number(match.team2["player" +i].playerstats2019.wins) + Number(winsTeamTwo);
                    match.team2["player" +i].playerstats2019.draws = Number(match.team2["player" +i].playerstats2019.draws) + Number(drawsTeamTwo);
                    match.team2["player" +i].playerstats2019.losses = Number(match.team2["player" +i].playerstats2019.losses) + Number(lossesTeamTwo);
                    $.ajax({
                        method: "PUT",
                        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/" + match.team1["player" +i]._id,
                        headers: getKinveyUserAuthHeaders(),
                        data: match.team1["player" +i],
                        error: handleAjaxError
                    });
                }      
            }
    

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

                        resetStats();
                    }