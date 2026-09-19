#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace AIStudio.Editor {
    public static class AIGameDirector41Editor {
        [MenuItem("AI Game Studio/4.1/Build AI Game Director")]
        public static void BuildDirector() {
            GameObject root = GameObject.Find("AI Game Director");
            if (root == null) root = new GameObject("AI Game Director");
            if (root.GetComponent<AIStudio.AIGameDirector41>() == null)
                root.AddComponent<AIStudio.AIGameDirector41>();
            AssetDatabase.SaveAssets();
            Debug.Log("AI Game Studio 4.1: AI Game Director created. Bind generated story, quest, NPC, world and event data to the runtime.");
        }
    }
}
#endif
