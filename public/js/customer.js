$(function(e) {
    $("#myInput").keyup(function(e) {
        const current = $(this)
        
        $("div.card h4.title").each(function(i) {
            if($(this).text().toLowerCase().includes(current.val().toLowerCase())){
                $(this).closest("div.wrapper").css({ display: "" })
            }else{
                $(this).closest("div.wrapper").css({ display: "none" })
            }
        })
    })
})