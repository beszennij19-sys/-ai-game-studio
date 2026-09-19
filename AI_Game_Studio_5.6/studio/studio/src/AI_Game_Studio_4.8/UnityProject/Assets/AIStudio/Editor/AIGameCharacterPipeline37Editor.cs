#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

namespace AIStudio.Editor {
    public static class AIGameCharacterPipeline37Editor {
        [MenuItem("AI Game Studio/3.7/Prepare Character Pipeline")]
        public static void Prepare() {
            string root = "Assets/AIStudio/Generated";
            if (!Directory.Exists(root)) Directory.CreateDirectory(root);
            AssetDatabase.Refresh();
            Debug.Log("AI Game Studio 3.7: character folders prepared. Import generated GLB/FBX, rig and animation assets into the project-specific folder, then create/assign the prefab.");
        }
    }
}
#endif
