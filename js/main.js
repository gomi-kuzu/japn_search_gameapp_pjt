var datas = null;
var myquery = null;
var use_idx_p = null;
var use_idx_c = null;
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


        // var myquery = `
        // SELECT ?s ?label ?thumbnail ?type ?time ?provider ?o (count(?thumbnail) as ?count) 
        // WHERE {?s schema:image ?thumbnail ;  
        //         rdfs:label ?label;
        //         schema:creator ?creator;
        //         a type:絵画; 
        //         jps:temporal/jps:era/rdfs:label ?time;
        //         jps:accessInfo/schema:provider/rdfs:label ?provider;
        //         schema:creator/rdfs:label ?o.
        // `
        // +
        // `FILTER (contains (?label,"`
        // +
        // key_word
        // +
        // `"))}LIMIT 1000`
        // ;
        
        set_query(1,``,``,``,``);


        $.get(
        url,
        {query: prefix + myquery},
        success, "json"
        );

        for (let i = 0; i < 8; i++) {
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
            const minitues = [...Array(data.results.bindings.length).keys()]
            use_idx_p = choose_at_random(minitues, 4)
            use_idx_c = []
            console.log(use_idx_p)
            for (let i = 0; i < 4; i++) {
                $('#result_img'+ String(i)).attr('src', data.results.bindings[use_idx_p[i]].thumbnail.value);
                var child_num = get_pair_author(data.results.bindings[use_idx_p[i]].o.value, use_idx_p[i],data)
                console.log(child_num)
                use_idx_c.push(child_num)
                console.log(data.results.bindings[use_idx_p[i]].o.value, data.results.bindings[child_num].o.value)
                $('#result_img'+ String(i+4)).attr('src', data.results.bindings[child_num].thumbnail.value);
                // console.log( getImageUrl(data.results.bindings[use_idx[i]].thumbnail.value) )
              }
            
            // for (let i = 0; i < 4; i++) {
            //     var child_num = get_pair_author(use_idx[i])


            // }
              
        }
        }
    }

    });

function set_query(mode, key_word, author, where, age){

    if (mode == 0){//debug
        myquery = `
        SELECT ?time (count(?cho) as ?count) WHERE {
            ?cho jps:temporal/jps:era ?time ;
                jps:sourceInfo ?source .
        } GROUP BY ?time`
        ;

    }


    if (mode == 1){//絵画縛りのみ
        myquery = `
        SELECT ?s ?label ?thumbnail ?type ?time ?provider ?o (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail ;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                jps:temporal/jps:era/rdfs:label ?time;
                jps:accessInfo/schema:provider/rdfs:label ?provider;
                schema:creator/rdfs:label ?o.
        `
        +
        `}LIMIT 3000`
        ;

    }



    if (mode == 2){//絵画縛り＋作者縛り
        myquery = `
        SELECT ?s ?label ?thumbnail ?type ?time ?provider ?o (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail ;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                jps:temporal/jps:era/rdfs:label ?time;
                jps:accessInfo/schema:provider/rdfs:label ?provider;
                schema:creator/rdfs:label ?o.
        `
        +
        `FILTER (contains (?time,"`
        +
        author
        +
        `"))}LIMIT 3000`
        ;
    }

    if (mode == 3){//絵画縛り＋所蔵館縛り
        myquery = `
        SELECT ?s ?label ?thumbnail ?type ?time ?provider ?o (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail ;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                jps:temporal/jps:era/rdfs:label ?time;
                jps:accessInfo/schema:provider/rdfs:label ?provider;
                schema:creator/rdfs:label ?o.
        `
        +
        `FILTER (contains (?provider,"`
        +
        where
        +
        `"))}LIMIT 3000`
        ;
    }

    if (mode == 4){//絵画縛り＋時代縛り
        myquery = `
        SELECT ?s ?label ?thumbnail ?type ?time ?provider ?o (count(?thumbnail) as ?count) 
        WHERE {?s schema:image ?thumbnail ;  
                rdfs:label ?label;
                schema:creator ?creator;
                a type:絵画; 
                jps:temporal/jps:era/rdfs:label ?time;
                jps:accessInfo/schema:provider/rdfs:label ?provider;
                schema:creator/rdfs:label ?o.
        `
        +
        `FILTER (contains (?time,"`
        +
        age
        +
        `"))}LIMIT 3000`
        ;
    }


}


function get_pair_author(key_value, parent_num , input){
    for (let i = 0; i < input.results.bindings.length; i++) {
        // console.log(input.results.bindings[i].o.value , key_value)
        if (input.results.bindings[i].o.value == key_value && i != parent_num)  {
            return i;
        }
    }
        return parent_num;
}


function show_label_and_creator(num){
    document.getElementById('result_label' + num).textContent = datas.results.bindings[use_idx_p[num]].label.value
    document.getElementById('result_creator' + num).textContent = datas.results.bindings[use_idx_p[num]].o.value + "：作"

}

function show_label_and_creator_c(num){
    document.getElementById('result_label' + num).textContent = datas.results.bindings[use_idx_c[num-4]].label.value
    document.getElementById('result_creator' + num).textContent = datas.results.bindings[use_idx_c[num-4]].o.value + "：作"
}


function init_show_label_and_creator(num){
    document.getElementById('result_label' + num).textContent = ""
    document.getElementById('result_creator' + num).textContent = ""
}

function choose_at_random(arrayData, count) {
    // countが設定されていない場合は1にする
    var count = count || 1;
    var arrayData = arrayData;
    var result = [];
    for (var i = 0; i < count; i++) {
        var arrayIndex = Math.floor(Math.random() * arrayData.length);
        result[i] = arrayData[arrayIndex];
        // 1回選択された値は削除して再度選ばれないようにする
        arrayData.splice(arrayIndex, 1);
    }
    return result;
}


function load(_url){
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("HEAD", _url, false);  //同期モード
  xhr.send(null);
  return xhr.status;
}

function getImageUrl(url){
  if(load(url) == 200)
    return url;
  if(load(url) == 200)
    return url;
  return "null";
}

// function imageElementCreateAndLoad (url) {
//     var promise = new Promise(function(resolve, reject) {
//         var image = new Image();
//         image.onload = function () {
//             resolve(image);
//         };
//         image.onerror = function() {
//             reject(new Error("Not Found"));
//         };
//         image.src = url;
//     });
//     return promise;
// }

// urls.reduce(
//     function (promise, url) {
//         return promise.then(
//             function onFulfilled(image) {
//                 return image.src;
//             },
//             function onRejected(value) {
//                 return imageElementCreateAndLoad(url)
//             }
//         )
//     },
//     Promise.reject()
// )
// .then(
//     function onFulfilled(url) {
//         return url;
//     },
//     function onRejected(value) {
//         return ''
//     }
// )
// .then(
//     function onFulfilled(url) {
//         console.log(JSON.stringify(url));
//     }
// )