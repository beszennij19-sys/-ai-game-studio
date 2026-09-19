#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;

namespace AIStudio.Editor {
    public static class AIGameGameplayWorld39Editor {
        [MenuItem("AI Game Studio/3.9/Prepare Gameplay World")]
        public static void Prepare() {
            string root = "Assets/AIStudio/Generated";
            if (!Directory.Exists(root)) Directory.CreateDirectory(root);
            AssetDatabase.Refresh();
            Debug.Log("AI Game Studio 3.9: gameplay-world runtime prepared. Bind NPCs, quests, resources, encounters and world events to the generated scene.");
        }
    }
}
#endif
