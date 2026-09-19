#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

namespace AIStudio.Editor {
    public static class AIGameWorldGenerator38Editor {
        [MenuItem("AI Game Studio/3.8/Prepare World Pipeline")]
        public static void Prepare() {
            string root = "Assets/AIStudio/Generated";
            if (!Directory.Exists(root)) Directory.CreateDirectory(root);
            AssetDatabase.Refresh();
            Debug.Log("AI Game Studio 3.8: world pipeline prepared. Import generated terrain/environment assets into the project-specific folder and build the scene from SceneManifest.json.");
        }
    }
}
#endif
