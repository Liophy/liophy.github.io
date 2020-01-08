function comparePoints(a, b) {
    if (Number(a.playerstats2018.points) < Number(b.playerstats2018.points))
        return 1;
    if (Number(a.playerstats2018.points) > Number(b.playerstats2018.points))
        return -1;
    return 0;
}


players.sort(comparePoints);


let playersTable = $('<table>')
    .append($('<tr>').append(
        '<th>N</th>' +
        ('<th>Име</th>') +
        ('<th>Ранг</th>') +
        ('<th>Точки</th>') +
        '<th>Мачове</th>' +
        '<th>Победи</th>' +
        '<th>Равни</th>' +
        '<th>Загуби</th>'
    ));
$('#players').append(playersTable);
let count = 1;


for (let player of players) {
    if (player.playerstats2018.points > 0) {
        appendPlayerRow(player, playersTable);
        count++;
    }
    if(count > 100){
    break
    }
}

function appendPlayerRow(player, playersTable) {

    playersTable.append($('<tr>').append(
        $('<td>').text(count),
        $('<td>').text(player.username),
        $('<td>').text(player.rank),
        $('<td>').text(player.playerstats2018.points),
        $('<td>').text(player.playerstats2018.matches),
        $('<td>').text(player.playerstats2018.wins),
        $('<td>').text(player.playerstats2018.draws),
        $('<td>').text(player.playerstats2018.losses),
        $('<td>')));
}
