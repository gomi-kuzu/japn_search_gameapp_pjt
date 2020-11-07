var datas = null;
search_button.addEventListener('click', function(e) {

    var url = "https://jpsearch.go.jp/rdf/sparql";
    var key_word = String(document.getElementById("search_word").value);

    if(key_word.length == 0) {
        // console.log("kake!");
        document.getElementById('warning').textContent = "何か書きなさいな";
    }
    else{

        // SELECT ?s ?label ?thumbnail ?type (count(?thumbnail) as ?count) 
        // WHERE {?s schema:image ?thumbnail;  
        //         rdfs:label ?label;
        //         schema:creator ?creator;
        //         a type:絵画; 
        //         schema:creator/schema:hasOccupation <http://ja.dbpedia.org/resource/浮世絵師>.

        // SELECT ?s ?label ?thumbnail ?type ?o (count(?thumbnail) as ?count)
        // WHERE {?s schema:image ?thumbnail;
        //         rdfs:label ?label;
        //         schema:creator ?creator;
        //         schema:creator/rdfs:label ?o.


        var myquery = `
        SELECT ?s ?label ?thumbnail ?type ?o (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                schema:creator/rdfs:label ?o.
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

        for (let i = 0; i < 4; i++) {
            init_show_label_and_creator(i);
        }    

        function success(data){
        console.log(data);
        if(data.results.bindings.length == 0){
            document.getElementById('warning').textContent = "一個も見つかりませんでした";
        }
        else{
            // document.getElementById('warning').textContent = String(data.results.bindings.length) + "件見つかりました";
            document.getElementById('warning').textContent = "";

            datas = data;
            for (let i = 0; i < 4; i++) {
                $('#result_img'+ String(i)).attr('src', data.results.bindings[i].thumbnail.value);
              }    
        }
        }
    }

    });

function show_label_and_creator(num){
    document.getElementById('result_label' + num).textContent = datas.results.bindings[num].label.value
    document.getElementById('result_creator' + num).textContent = datas.results.bindings[num].o.value + "：作"

}

function init_show_label_and_creator(num){
    document.getElementById('result_label' + num).textContent = ""
    document.getElementById('result_creator' + num).textContent = ""
}