#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace AIStudio.Editor {
    public static class AIGameRuntime40Editor {
        [MenuItem("AI Game Studio/4.0/Build Unified Runtime")]
        public static void BuildRuntime() {
            GameObject root = GameObject.Find("AI Game Runtime");
            if (root == null) root = new GameObject("AI Game Runtime");
            var runtime = root.GetComponent<AIStudio.AIGameRuntime40>();
            if (runtime == null) runtime = root.AddComponent<AIStudio.AIGameRuntime40>();
            var bootstrap = root.GetComponent<AIStudio.AIGameRuntimeBootstrap40>();
            if (bootstrap == null) bootstrap = root.AddComponent<AIStudio.AIGameRuntimeBootstrap40>();
            AssetDatabase.SaveAssets();
            Debug.Log("AI Game Studio 4.0: unified runtime object created. Connect generated player, world, NPC, quest, UI and input components in the scene.");
        }
    }
}
#endif
