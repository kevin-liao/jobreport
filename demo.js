$(document).ready(function(){
  var globalObject = {};
  // 1.	Use JQuery to fetch a JSON data
  $("button.first").click(function(){
	projects = getProjectData(globalObject);
  });
  
  $("button.second").click(function(){
    projectCats = getProjectCatData(globalObject);
  });
  
  // the third button to show projects
  $("button.third").click(function(){    
    if (!globalObject.projects || !globalObject.projectCats) {
		alert("either projects or projectCats object is null. Please run the first two tasks.");
		return;
	}
    var relations = buildRelations(globalObject.projects.job, globalObject.projectCats.jobcategory);
	// 3. List all the projects grouped by project categories
	listProjectsGroupedByCategory(relations);
  });
  
  // 4. Bind a click function on the project title and display the project details
  $("button.fourth").click(function(){
    if (!globalObject.projects || !globalObject.projectCats) {
		alert("Please run all previous tasks.");
		return;
	}
	
    if (!!globalObject) {
		bindClickEventHandler(globalObject);
	}
  });
  
  // clean all messages
  $("button.fifth").click(function(){
    $("#message").html("");
  });
  
});

// build the click event handler
function bindClickEventHandler(globalObject) {
	$("a.job").each(function() {
	    var jobId = $(this).attr("data-id");
		if (jobId) {
			$(this).bind('click', function(){
				// clean the previous data
				$("div#"+ jobId).remove();
				$("div#row-"+ jobId).remove();
				
				var job = getJobById(globalObject, jobId);
				if (!!job) {
					var buffer = ["<div class='detail' id='" + jobId + "'>", 
					"<li>Job Number: ", job.JOBNUMBER, "</li>",
					"<li>Company Name - Company Code: ", job.COMPANYNAME + '-' + job.COMPANYCODE, "</li>",
					"<li>Contact Name: ", job.CONTACTNAME, "</li>",
					"<li>Job Priority: ", job.JOBPRIORITY, "</li>",
					"<li>Start Date: ", job.STARTDATE, "</li>", 
					"<li>Due Date: ", job.DUEDATE, "</li>", "</div>", 
					"<div class='rowDivider' id='row-" + jobId + "'></div>"];
					var output = buffer.join("");
					$(this).after(output);
				}
				
			});
		}
	});
}

// get job from global object by id
function getJobById(globalObject, jobId) {
	if (!globalObject)
	{
		return;
	}
	
	var jobs = globalObject.projects.job;
	for (var i = 0; i < jobs.length; i++) {
		var job = jobs[i];
		if (job.JOBID == jobId) {
			return job;
		}
	}
}

function getProjectData(globalObject) {
	// url would be http://dev.proworkflow.com/test/projects.json
	ajaxGetData(globalObject, "projects.json", false);
}

function getProjectCatData(globalObject) {
	// url would be http://dev.proworkflow.com/test/projectcat.json
	ajaxGetData(globalObject, "projectcat.json", true);
}

function ajaxGetData(globalObject, url, forProjectCat) {
	$.ajax({
		type: "GET",  // GET or POST
		contentType: "application/json", 
		url: url, 
		data: "{}",  //
		dataType: 'json',
		success: function(result) {
			if (forProjectCat) {
				globalObject.projectCats = result;
			}
			else {
				globalObject.projects = result;
			}
		}
	});
}

function buildRelations(jobs, jobCategories) {
	if (!jobs || !jobCategories)
	{
		return;
	}
	
	// the result returned
	var relations = {};
	for (var i = 0; i < jobCategories.length; i++) {
		var category = jobCategories[i];
		var values = [];
		for (var j = 0; j < jobs.length; j++) {
			var job = jobs[j];
			if (job.PROJECTCATID == category.ID) {
				values.push(job);
			}
		}
		relations[category.TITLE] = values;
	}
	return relations;
}

function listProjectsGroupedByCategory(relations) {
    if (!relations)	{
		return;
	}
	// clean the previous data
	$("#message").html("");
	
	var output = "";
	$.each(relations, function(key, value) {
	    // output the category, beginning half
		output = output + "<ul>Project Category: " + key;
		// output the jobs
		var jobs = "";
		$.each(value, function(job) {
			var anchorId = value[job].JOBID;
			var anchor = "<a class='job' href='##' data-id='" + anchorId + "' >";
		    jobs += "<li> Job Title: " + anchor + value[job].JOBTITLE + "</a>" +"</li>";
		});
		// output the category, ending half
		output = output + jobs + "</ul>";
	});
	$("#message").append(output);
}