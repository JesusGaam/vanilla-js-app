hbspt.forms.create({
  region: "na1",
  portalId: "50404086",
  formId: "f30460bc-79b2-4e42-b8b2-f321001e7f79",
  onFormReady: onFormReady
});


function onFormReady(form) {
  form.find(".hs-form__virality-link").hide();
  updateStyles(form);
}

function updateStyles(form) {
  form.find(".hs_submit .actions").css({ margin: 0, padding: 0, textAlign: "right" });
  form.find(".field").css({ marginBottom: '14px', });
  form.find("label").css({ color: "#1c1c1c", fontSize: "16px", paddingLeft: "16px",paddingBottom: "2px" })
  form.find("input[type=text], input[type=email], input[type=tel], textarea").css({ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF", color: "#4d4d4d", borderRadius: "22px", padding: "12px 16px" });
  form.find("input[type=submit]").attr("id", "form-submit").css({ backgroundColor: "#E8FF00", borderColor: "#E8FF00", padding: "18px 40px", marginTop: "8px", color: "#1c1c1c", borderRadius: "22px", fontSize: "18px", });
}