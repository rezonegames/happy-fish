import {Component, _decorator, ProgressBar, director, assetManager, Label} from "cc";
import {resLoader} from "db://assets/core/res/res-loader";


const {property, ccclass} = _decorator;

@ccclass
export default class UIExample extends Component {

    @property(ProgressBar) progress: ProgressBar;
    @property(Label) tips: Label;

    onLoad() {
    }

    start() {
        let [total, taskList, bundleName] = [
            7,
            ["scene", "config", "script", "texture", "anim", "prefab", "material", "effect"],
            "game"
        ];

        const onProgress = (finished: number, total: number, item: any) => {
            // this.loadingProgressBar.progress += finished/(total*5);
        }

        const onFinish = () => {
            let dir = taskList.pop();
            this.progress.progress = (total - taskList.length) / total;
            // 加载主场景
            if (!dir) {
                let bundle = assetManager.getBundle(bundleName);
                bundle.loadScene("scene/main", function (err, scene) {
                    director.runScene(scene);
                });
            } else {
                console.log(`${dir} finished`);
                this.tips.string = dir;
                resLoader.loadDir(bundleName, dir, onProgress.bind(this), onFinish.bind(this));
            }
        }
        this.tips.string = taskList[0];
        resLoader.loadDir(bundleName, taskList[0], onProgress.bind(this), onFinish.bind(this));
    }
}
