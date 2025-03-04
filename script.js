document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio");
    const transcriptDiv = document.getElementById("transcript");
    const vttUrl = "subtitles.vtt";

    fetch(vttUrl).then(res => res.text()).then(vttData => {
        const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
        const cues = [];

        parser.oncue = cue => { cues.push(cue); };
        parser.parse(vttData);
        parser.flush();

        cues.forEach(cue => {
            const segment = document.createElement("span");
            segment.className = "transcript-segment";
            segment.textContent = cue.text;
            segment.dataset.startTime = cue.startTime;

            segment.addEventListener("click", () => {
                audio.currentTime = cue.startTime;
                audio.play();
            });

            transcriptDiv.appendChild(segment);
        });

        // Hightlight segments according audio
        audio.addEventListener("timeupdate", () => {
            const currentTime = audio.currentTime;
            document.querySelectorAll(".transcript-segment").forEach((segment, index) => {
                const cue = cues[index];
                if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
                    segment.classList.add("active");
                } else {
                    segment.classList.remove("active");
                }
            });
        });

    }).catch(err => {
        console.error("Filed to load VTT file", err);
    });
});

