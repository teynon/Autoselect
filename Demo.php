<html>
<head>
<title>
Autoselect Demo
</title>
<script type="text/Javascript" src="jquery/jquery1.7.js"></script>
<script type="text/Javascript" src="AS/autoselect.js"></script>
<script>
$(document).ready(function() {
    $('input').Autoselect({ 'url' : 'search.php', 'width' : 'match' }, function(display_text, resultvalue) {
        alert("You selected " + display_text + " which has a value of " + resultvalue);
    });
});

</script>
<style>
    .Autoselect_window {
        border: 1px solid #000000;
    }
</style>
</head>
<body>
    <div align="center">
    <input id="test" type="text" name="Username" value="">
    </div>
</body>
</html>