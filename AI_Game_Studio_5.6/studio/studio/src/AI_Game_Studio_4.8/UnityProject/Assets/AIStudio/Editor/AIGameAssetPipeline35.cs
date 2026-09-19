#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;

namespace AIStudio.Editor {
    public static class AIGameAssetPipeline35 {
        [MenuItem("AI Game Studio/3.5/Build Asset Pipeline Manifest")]
        public static void BuildManifest() {
            var source = Path.GetFullPath(Path.Combine(Application.dataPath, "../Studio/data/Blueprint.json"));
            var tool = Path.GetFullPath(Path.Combine(Application.dataPath, "../Studio/asset-pipeline/build-3.5.js"));
            if (!File.Exists(source) || !File.Exists(tool)) { Debug.LogError("3.5 pipeline files are missing."); return; }
            Debug.Log("AI Game Studio 3.5: run Studio/asset-pipeline/build-3.5.js with Node to create the manifest, then import completed assets into Assets/AIStudio/Generated/<ProjectID>.");
            AssetDatabase.Refresh();
        }

        [MenuItem("AI Game Studio/3.5/Create Generated Asset Folders")]
        public static void CreateFolders() {
            var data = Path.Combine(Application.dataPath, "AIStudio/Data/Blueprint.json");
            var projectId = "PROJECT-UNASSIGNED";
            if (File.Exists(data)) {
                var json=File.ReadAllText(data);
                var marker="\"projectId\""; var i=json.IndexOf(marker); if(i>=0){ var c=json.IndexOf(':',i); var q1=json.IndexOf('"',c+1); var q2=json.IndexOf('"',q1+1); if(q1>=0&&q2>q1) projectId=json.Substring(q1+1,q2-q1-1); }
            }
            var root = Path.Combine(Application.dataPath, "AIStudio/Generated", projectId);
            foreach(var type in new[]{"characters","environment","props","materials","animations","audio","ui"}) Directory.CreateDirectory(Path.Combine(root,type));
            AssetDatabase.Refresh();
            Debug.Log("Created project-scoped generated asset folders for " + projectId);
        }
    }
}
#endif
