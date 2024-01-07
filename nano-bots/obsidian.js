class ObsidianHelpers {
  static async insertText(editor, content, region, mode = 'replace', prefix = '') {
    // The mode refers to how the answer will be delivered when a text is selected.
    // add will add the answer after the selected text, while replace will replace
    // it with the answer.
    // When 'add' is defined, you may also want to add a prefix like "\n".

    // TODO: The only mode implemented so far is 'replace'; 'add' is missing.

    editor.replaceSelection(content);
  }
}

export default ObsidianHelpers;
