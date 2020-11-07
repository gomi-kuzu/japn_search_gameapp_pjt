var datas = null;
search_button.addEventListener('click', function(e) {

    var url = "https://jpsearch.go.jp/rdf/sparql";
    var key_word = String(document.getElementById("search_word").value);

    if(key_word.length == 0) {
        // console.log("kake!");
        document.getElementById('warning').textContent = "何か書きなさいな";
    }
    else{
        var myquery = `
        SELECT ?s ?label ?thumbnail ?type (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                schema:creator/schema:hasOccupation <http://ja.dbpedia.org/resource/浮世絵師>. 
        `
        +
        `FILTER (contains (?label,"`
        +
        key_word
        +
        `"))}LIMIT 100`
        ;
    
        $.get(
        url,
        {query: prefix + myquery},
        success, "json"
        );
        
        function success(data){
        console.log(data.results.bindings);
        if(data.results.bindings.length == 0){
            document.getElementById('warning').textContent = "見つかりませんでした";
        }
        else{
            // document.getElementById('warning').textContent = String(data.results.bindings.length) + "件見つかりました";
            datas = data;
            for (let i = 0; i < 4; i++) {
                $('#result_img'+ String(i)).attr('src', data.results.bindings[i].thumbnail.value);
              }    
        }
        }
    }

    });

function show_label(num){
    document.getElementById('result_label' + num).textContent = datas.results.bindings[num].label.value
}

