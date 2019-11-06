const {BrowserWindow,ipcMain,dialog,screen} = require('electron').remote
const cmd = require('node-cmd')
const path = require('path')
const http =require('http')
const ipc = require('electron').ipcRenderer;
// const midiBtn = $("#choosemidi")
const showMidiBtn = $("#showmidi")
const screenMidiBtn = $("#showscreen")

const midiurl = path.resolve(__dirname, '../midi') + '\\sendmidi.exe';

// midiBtn.on('click',(event)=>{
//     dialog.showOpenDialog({properties:['openFile']},(file)=>{
//         if(file){
//             $("#midiurl").html(file);
//         }
//     })
// })
screenMidiBtn.on('click',()=>{
    var displays = screen.getAllDisplays()
    $("#screen_div").html('');
    for(let i in displays){
        $("#screen_div").append('<div class="cbtn screen_btn button button-glow button-rounded button-primary" data="'+i+'">屏幕'+i+':'+displays[i].bounds.x+','+displays[i].bounds.y+','+displays[i].bounds.height+','+displays[i].bounds.width+'</div>')
    }
    $('.screen_btn').on('click',(event)=>{
        let click_i = $(event.target).attr('data');
        $('#now_show').html('屏幕'+click_i);

        ipc.send('show_screen',displays[click_i].bounds);
    })
    
})
showMidiBtn.on('click',()=>{   

    var cmd_str = "\"" + midiurl+"\"" + " list";
    cmd.get(
        cmd_str,
        function(err,data,stderr){
            console.log(data)
            $("#midilist_div").html('')
            var midi_arr = data.split('\n')
            for(var i=0;i<midi_arr.length;i++){
                if(midi_arr[i]!=''){
                    var tmp = midi_arr[i].substring(0,midi_arr[i].length-1)
                    $("#midilist_div").append('<div class="cbtn midi_dev button button-glow button-rounded button-primary">'+midi_arr[i]+'</div>')
                }     
            }

            $('.midi_dev').on('click',(event)=>{
                $('#mididev').html(event.target.innerText)
                //
            })
        }
    )

})

ipc.on('sendmidi',(event,data)=>{
    console.log(data)
    let midi_dev= $('#mididev').html();
    if(data == 'exploded'){
        var cmd_str = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 on 16 16';
        cmd.run(cmd_str)
        var cmd_str2 = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 off 16 16';
        cmd.run(cmd_str2)
    }
    if(data == 'defused'){
        var cmd_str = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 on 17 17';
        cmd.run(cmd_str)
        var cmd_str2 = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 off 17 17';
        cmd.run(cmd_str2)
    }
    if(data == 'planted'){
        var cmd_str = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 on 17 17';
        cmd.run(cmd_str)
        var cmd_str2 = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 off 17 17';
        cmd.run(cmd_str2)
    }
    if(data == 'multikill'){
        var cmd_str = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 on 17 17';
        cmd.run(cmd_str)
        var cmd_str2 = "\"" + midiurl+"\"" + ' dev "'+ midi_dev +'" ch 1 off 17 17';
        cmd.run(cmd_str2)
    }
    let myDate = new Date();
    let log =  myDate.toLocaleString() +' ' +data + '\n' + $('#service_log').val();
    $("#service_log").val(log);
})