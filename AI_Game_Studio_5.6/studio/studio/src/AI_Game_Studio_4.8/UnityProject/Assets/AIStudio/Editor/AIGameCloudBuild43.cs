#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System.IO;
public static class AIGameCloudBuild43 {
  [MenuItem("AI Game Studio/4.3/Prepare Cloud Build")]
  public static void Prepare() {
    var root = Path.GetFullPath(Path.Combine(Application.dataPath,"../.."));
    var dir = Path.Combine(root,"Build"); Directory.CreateDirectory(dir);
    File.WriteAllText(Path.Combine(dir,"CLOUD_BUILD_READY.txt"),"AI Game Studio 4.3 Cloud Build prepared. Configure CI credentials before compiling.");
    AssetDatabase.Refresh(); Debug.Log("AI Game Studio 4.3: Cloud Build prepared.");
  }
}
#endif
